import { supabase } from "@/lib/supabase"
import { Notification } from "@/typing/type";

// get post by id
export const getPostById = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

// get all posts
export const getAllPosts = async () => {
const {data , error} = await supabase.from("posts").select(`
  *,
  profiles (
    username,
    avatar_url
  )
`).order("created_at", { ascending: false });

if(error) throw error;
return data;

}

// get likes from db
export const getLikesByPostId = async (postId: string, userId?: string) => {
  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  let liked = false;
  if (userId) {
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    liked = !!data;
  }

  return {
    count: count || 0,
    liked,
  };
};
// add or remove like from db

// get comments from db
export const getCommentByPostId = async (postId: string) => {
  const {data , error} = await supabase.from("comments")
        .select(
          `id, content, created_at, user_id, profiles (username, avatar_url)`,
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

if(error) throw error;

return data;

}

// add comment to db
type CommentType = {
  postId: string;
  userId: string;
  content: string;
}
export const addComment = async ({
  postId,
  userId,
  content,
}: CommentType) => {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      content,
    })
    .select("id")
    .single();

  if (error) throw error;

  return data;
};

// get users from db
export const getUsers = async () => {
const {data , error} = await supabase.from("profiles").select("*")
if(error) throw error;
return data;

}

// follow or unfollow user

export const getFollowData = async (profileId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) throw new Error("User not logged in");

  // check following
  const { data: followData } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", userId)
    .eq("following_id", profileId)
    .maybeSingle();

  // count followers
  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profileId);

  return {
    isFollowing: !!followData,
    followersCount: count || 0,
    userId,
  };
};

export const toggleFollow = async ({
  profileId,
  userId,
  isFollowing,
}: {
  profileId: string;
  userId: string;
  isFollowing: boolean;
}) => {
  if (isFollowing) {
    return await supabase
      .from("follows")
      .delete()
      .eq("follower_id", userId)
      .eq("following_id", profileId);
  }

  return await supabase.from("follows").insert({
    follower_id: userId,
    following_id: profileId,
  });
};


// get and send chat between users


export async function getOrCreateConversation(
  currentUserId?: string,
  otherUserId?: string
): Promise<string> {
  const [p1, p2] = [currentUserId, otherUserId].sort();

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("participant_one", p1)
    .eq("participant_two", p2)
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ participant_one: p1, participant_two: p2 })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}

// get current user
export const getCurrentUser = async () => {
  // get user id from supabase auth
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;

  // لو مفيش user
  if (!user) return null;

  // 2) get user data from profiles table by user id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) throw profileError;

  // 3) رجّع الاتنين مع بعض
  return {
    user,
    profile,
  };
};



// get storis from db
export const getStories = async () => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: true }) // ✅ ascending عشان الترتيب صح جوا الـ viewer

  if (error) throw error;

  // ✅ group by user_id
  const grouped = data.reduce((acc, story) => {
    const key = story.user_id;
    if (!acc[key]) {
      acc[key] = {
        user_id: story.user_id,
        username: story.username,
        avatar_url: story.avatar_url,
        avatar_bg: story.avatar_bg,
        stories: [],
      };
    }
    acc[key].stories.push(story);
    return acc;
  }, {});

  return Object.values(grouped);
  // ✅ النتيجة:
  // [
  //   { user_id, username, avatar_url, avatar_bg, stories: [...] },
  //   { user_id, username, avatar_url, avatar_bg, stories: [...] },
  // ]
};

// ✅ رفع الـ file على Cloudinary
const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
formData.append("upload_preset", "social_app"); // من Cloudinary Dashboard

  const res = await fetch(
      `https://api.cloudinary.com/v1_1/dc4c10a3f/auto/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (!data.secure_url) throw new Error("فشل رفع الملف");
  return data.secure_url;
};

export const addNewStorie = async ({ content, file, isImage, avatarBg }: {
  content?: string;
  file?: File;
  isImage?: boolean;
  avatarBg?: string;
}) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("مش logged in");

  const { user, profile } = currentUser;

  // ✅ لو في file ارفعه الأول
  let mediaUrl = null;
  let mediaType = null;

  if (file) {
    mediaUrl = await uploadToCloudinary(file);
    mediaType = isImage ? "image" : "video";
  }

  const { data, error } = await supabase.from("stories").insert({
    user_id: user.id,
    username: profile.username,
    avatar_url: profile.avatar_url,
    avatar_bg: avatarBg || profile.avatar_bg,
    media_url: mediaUrl,
    media_type: mediaType,
    content: content || null,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  if (error) throw error;
  return data;
};



// get notificatoins
const NOTIFICATIONS_PER_PAGE = 20

export const getNotifications = async (
  userId: string,
  page: number = 0
): Promise<Notification[]> => {
  const from = page * NOTIFICATIONS_PER_PAGE
  const to = from + NOTIFICATIONS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      sender:sender_id ( id, username, avatar_url ),
      post:post_id ( id, content )
    `)
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)  // ✅ pagination

  if (error) throw new Error(error.message)

  return data ?? []  // ✅ مش هترجع null أبداً
}


// remove notification item from supabase
export const removeNotificationById = async (id: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};
