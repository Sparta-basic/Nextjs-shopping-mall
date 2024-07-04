import { createClient } from "@/utils/supabase/client";

// supabase auth server에서 로그인 유저 확인
// 신뢰도 높음
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await createClient().auth.getUser();
  return { user, error };
}

// 로컬 스토리지 혹은 쿠키에서 로그인 유저 확인
// 신뢰도 낮음
export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await createClient().auth.getSession();
  return { session, error };
}
