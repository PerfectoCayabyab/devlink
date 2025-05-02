import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import type { Metadata } from "next";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";

type LinkType = {
  id: string;
  title: string;
  url: string;
  icon: string;
};

type UserType = {
  name: string;
  image: string;
  bio: string;
  links: LinkType[];
};

async function getUserByUsername(username: string): Promise<UserType | null> {
  await connectToDatabase();
  const raw = await User.findOne({ username }).lean();
  return raw ? (raw as unknown as UserType) : null;
}

export async function generateMetadata(
  props: Promise<{ params: { username: string } }>
): Promise<Metadata> {
  const { params } = await props;
  const user = await getUserByUsername(params.username);

  if (!user) {
    return { title: "User not found - DevLink" };
  }

  return {
    title: `${user.name} | DevLink`,
    description: user.bio || "Developer profile",
    openGraph: {
      title: `${user.name} | DevLink`,
      description: user.bio || "Developer profile",
      images: [
        {
          url: user.image || "/default-og.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProfilePage(
  props: Promise<{ params: { username: string } }>
) {
  const { params } = await props;
  const user = await getUserByUsername(params.username);
  if (!user) return notFound();

  const iconMap: Record<string, React.ReactNode> = {
    github: <Github className="w-5 h-5 mr-2" />,
    linkedin: <Linkedin className="w-5 h-5 mr-2" />,
    twitter: <Twitter className="w-5 h-5 mr-2" />,
    website: <Globe className="w-5 h-5 mr-2" />,
    default: <LinkIcon className="w-5 h-5 mr-2" />,
  };

  return (
    <Shell>
      <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto text-center">
        <Image
          height={112}
          width={112}
          src={user.image || "/default-avatar.png"}
          alt={user.name}
          className="rounded-full mx-auto border-4 border-blue-500 shadow-md"
        />
        <h1 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">
          {user.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{user.bio}</p>

        <div className="mt-8 flex flex-col gap-3 items-center">
          {user.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-5 py-3 w-full sm:w-auto rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow hover:shadow-md transition text-blue-600 hover:text-blue-800"
            >
              {iconMap[link.icon?.toLowerCase()] || iconMap.default}
              <span>{link.title}</span>
            </a>
          ))}
        </div>

        <p className="mt-12 text-sm text-gray-400">Made with 💙 on DevLink</p>
      </main>
    </Shell>
  );
}
