import { NextResponse } from "next/server";

/* ══════════════════════════════════════════════════════════
   Live Activity Feed — GitHub + Status
   GET /api/activity
══════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
  html_url: string;
}

interface GitHubRepo {
  name: string;
  html_url: string;
  pushed_at: string;
}

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "mahadshah-cyber";
  const token    = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "mahad-portfolio/2.0",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    // Fetch latest repos ordered by push date
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=5`,
      { headers, next: { revalidate: 300 } }
    );

    let lastCommit = {
      repo: "portfolio",
      message: "feat: ultra advanced portfolio v2",
      url: `https://github.com/${username}`,
      time: new Date().toISOString(),
    };

    if (reposRes.ok) {
      const repos: GitHubRepo[] = await reposRes.json();
      if (repos.length > 0) {
        const latest = repos[0];
        // Get latest commit from that repo
        const commitRes = await fetch(
          `https://api.github.com/repos/${username}/${latest.name}/commits?per_page=1`,
          { headers, next: { revalidate: 300 } }
        );
        if (commitRes.ok) {
          const commits: GitHubCommit[] = await commitRes.json();
          if (commits.length > 0) {
            lastCommit = {
              repo: latest.name,
              message: commits[0].commit.message.split("\n")[0].slice(0, 72),
              url: commits[0].html_url,
              time: commits[0].commit.author.date,
            };
          }
        }
      }
    }

    return NextResponse.json({
      lastCommit,
      status: process.env.CURRENT_STATUS || "Building",
      online: true,
      username,
    });
  } catch {
    return NextResponse.json({
      lastCommit: {
        repo: "portfolio",
        message: "feat: ultra advanced portfolio v2",
        url: `https://github.com/${username}`,
        time: new Date().toISOString(),
      },
      status: "Building",
      online: true,
      username,
    });
  }
}
