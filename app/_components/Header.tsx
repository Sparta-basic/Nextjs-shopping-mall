"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PRIVATE_ROUTES } from "@/constants/path";
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const supabase = createClient();
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user || null);
			if (!session && PRIVATE_ROUTES.includes(pathname)) {
				router.push("/auth/login");
			}
		});

		return () => {
			data.subscription.unsubscribe();
		};
	}, [router, pathname]);

	const logout = async () => {
		await createClient().auth.signOut();
	}

	return (
		<div className="p-2 flex justify-between items-center gap-x-2">
			<Link href="/">Home</Link>
			<div className="flex items-center gap-x-2">
				{user ?
					(
						<>
							<div>{user.email}</div>
							<button onClick={logout}>로그아웃</button>
						</>
					)
					:
					(
						<>
							<Link href="/auth/login">로그인</Link>
							<Link href="/auth/signup">회원가입</Link>
						</>
					)
				}
			</div>
		</div>
	)
}