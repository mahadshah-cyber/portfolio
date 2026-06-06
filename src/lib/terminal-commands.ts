"use client";

/* ═══════════════════════════════════════════════════════════
   Terminal Commands Engine
   20+ commands, fake filesystem, easter eggs, CTF flags
═══════════════════════════════════════════════════════════ */

export interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "system" | "success" | "ascii" | "warn";
}

// Fake filesystem
const FILESYSTEM: Record<string, Record<string, string>> = {
  "/": { type: "dir" },
  "/home": { type: "dir" },
  "/home/mahad": { type: "dir" },
  "/home/mahad/projects": { type: "dir" },
  "/home/mahad/ctf": { type: "dir" },
  "/etc": { type: "dir" },
  "/secrets": { type: "dir" },
  "/var/log": { type: "dir" },
  "/home/mahad/projects/portfolio.md": {
    type: "file",
    content: "# Portfolio v2\nStack: Next.js 16, GSAP, Tailwind, Prisma\nStatus: DEPLOYED ✓",
  },
  "/home/mahad/ctf/writeups.txt": {
    type: "file",
    content: "Bandit: 1-10 ✓\nTryHackMe: Basic SQLi ✓\nCTFlearn: Crypto101 ✓\nPicoCTF: Web Exploit (Active)",
  },
  "/etc/passwd": {
    type: "file",
    content: `root:x:0:0:root:/root:/bin/bash
mahad:x:1000:1000:Syed Mahad Shah,,,:/home/mahad:/bin/zsh
kali:x:1337:1337:Kali Linux,,,:/home/kali:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin`,
  },
  "/secrets/flag.txt": {
    type: "file",
    content: "CTF{y0u_f0und_th3_h1dd3n_fl4g_mahad_is_aw3s0m3}\n\nCongrats. You're curious enough to be dangerous.",
  },
  "/var/log/system.log": {
    type: "file",
    content: `[2026-06-06 14:00:01] INFO  System boot complete
[2026-06-06 14:00:02] INFO  Firewall rules loaded: 2048 entries
[2026-06-06 14:00:04] WARN  Unauthorized scan detected from 192.168.1.77
[2026-06-06 14:00:05] INFO  Countermeasures deployed
[2026-06-06 14:00:09] INFO  All systems nominal`,
  },
};

let cwd = "/home/mahad";
let sudoAttempts = 0;

export function resetTerminalState() {
  cwd = "/home/mahad";
  sudoAttempts = 0;
}

function resolvePath(path: string): string {
  if (path.startsWith("/")) return path;
  if (path === "~") return "/home/mahad";
  if (path === "..") {
    const parts = cwd.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
  }
  return cwd + "/" + path;
}

export async function processCommand(
  rawCommand: string,
  currentLogs: LogLine[],
  callbacks: {
    setLogs: (l: LogLine[]) => void;
    setMatrixActive: (v: boolean) => void;
    setHackNasaActive: (v: boolean) => void;
    routerPush: (path: string) => void;
    activateHackerMode: () => void;
    getSudoAttempts: () => number;
    setSudoAttempts: (n: number) => void;
  }
): Promise<void> {
  const trimmed = rawCommand.trim();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const add = (...lines: LogLine[]) => {
    callbacks.setLogs([...currentLogs, ...lines]);
  };

  const out = (text: string): LogLine => ({ text, type: "output" });
  const sys = (text: string): LogLine => ({ text, type: "system" });
  const err = (text: string): LogLine => ({ text, type: "error" });
  const ok  = (text: string): LogLine => ({ text, type: "success" });
  const warn = (text: string): LogLine => ({ text, type: "warn" });

  switch (cmd) {
    case "help": {
      add(
        sys("╔══════════════════════════════════════════════════╗"),
        sys("║         MAHAD-SEC TERMINAL — COMMAND INDEX       ║"),
        sys("╚══════════════════════════════════════════════════╝"),
        out(""),
        out("  whoami          — Display current operator identity"),
        out("  about           — Operator bio & mission"),
        out("  skills          — Technical proficiency scan"),
        out("  projects        — Fetch project database"),
        out("  ctf             — CTF challenge log"),
        out("  ls [path]       — List directory contents"),
        out("  cat [file]      — Read file contents"),
        out("  cd [dir]        — Change directory"),
        out("  pwd             — Print working directory"),
        out("  uname -a        — System kernel info"),
        out("  ifconfig        — Network interface data"),
        out("  ps aux          — Running process list"),
        out("  nmap [target]   — Port scan target"),
        out("  sudo su         — Attempt privilege escalation"),
        out("  sudo --override — [CLASSIFIED]"),
        out("  history         — Command history"),
        out("  curl [url]      — Fetch remote resource"),
        out("  decrypt         — Launch hex decryption challenge"),
        out("  matrix          — Deploy digital rain overlay"),
        out("  hack nasa       — [EASTER EGG]"),
        out("  guitar          — [EASTER EGG]"),
        out("  neofetch        — System info banner"),
        out("  clear           — Clear terminal buffer"),
        out("  exit            — Terminate session"),
        out(""),
      );
      break;
    }

    case "whoami": {
      add(
        ok("mahad@kali-sec"),
        out("  Full Name  : Syed Mahad Shah"),
        out("  Role       : Cybersecurity Researcher & Full-Stack Developer"),
        out("  Base       : KPK, Pakistan"),
        out("  UID        : 1337"),
        out("  Groups     : sudo, security, developers"),
        out(""),
      );
      break;
    }

    case "about": {
      add(
        sys("══════════════════ OPERATOR PROFILE ══════════════════"),
        out("  Identity   : Syed Mahad Shah"),
        out("  Role       : Full-Stack Developer & Cybersecurity Specialist"),
        out("  Education  : UET Peshawar — Computer Science"),
        out("  Score      : 86% — Higher Secondary Computer Science"),
        out("  Base Node  : Peshawar, KPK, Pakistan"),
        out(""),
        out("  DIRECTIVES:"),
        out("  • Defending cloud resources & network surfaces"),
        out("  • Building cinematic, production-grade web apps"),
        out("  • Exploiting CTF challenges & writing public writeups"),
        out("  • Learning reverse-engineering & malware analysis"),
        out("  • Contributing to open-source security tooling"),
        out(""),
        sys("══════════════════════════════════════════════════════"),
        out(""),
      );
      break;
    }

    case "skills": {
      const bars = [
        { name: "C Programming",    level: 65 },
        { name: "Java",             level: 60 },
        { name: "Python",           level: 45 },
        { name: "HTML / CSS",       level: 75 },
        { name: "JavaScript / TS",  level: 70 },
        { name: "React / Next.js",  level: 55 },
        { name: "Cybersecurity",    level: 40 },
        { name: "SQL",              level: 50 },
        { name: "Git / Linux",      level: 65 },
      ];
      const barLines: LogLine[] = bars.map(({ name, level }) => {
        const filled = Math.round(level / 10);
        const empty = 10 - filled;
        const bar = "█".repeat(filled) + "░".repeat(empty);
        return out(`  ${name.padEnd(18)} [${bar}] ${level}%`);
      });
      add(
        sys("SCANNING TECHNICAL MATRIX..."),
        out(""),
        ...barLines,
        out(""),
      );
      break;
    }

    case "ls": {
      const targetPath = args[0] ? resolvePath(args[0]) : cwd;
      const entries = Object.keys(FILESYSTEM).filter((k) => {
        const parent = k.substring(0, k.lastIndexOf("/")) || "/";
        return parent === targetPath && k !== targetPath;
      });
      if (entries.length === 0 && !FILESYSTEM[targetPath]) {
        add(err(`ls: cannot access '${targetPath}': No such file or directory`));
      } else {
        const items = entries.map((e) => {
          const name = e.split("/").pop() || e;
          const isDir = FILESYSTEM[e]?.type === "dir";
          return out(`  ${isDir ? "\x1b[34m" : ""}${name}${isDir ? "/" : ""}  `);
        });
        if (args.includes("-la") || args.includes("-l")) {
          add(
            out(`total ${entries.length * 4}`),
            out("drwxr-xr-x  2 mahad mahad 4096 Jun  6 14:00 ."),
            out("drwxr-xr-x 12 mahad mahad 4096 Jun  6 14:00 .."),
            ...entries.map((e) => {
              const name = e.split("/").pop() || e;
              const isDir = FILESYSTEM[e]?.type === "dir";
              return out(`${isDir ? "d" : "-"}rwxr-xr-x  1 mahad mahad  4096 Jun  6 14:00 ${name}`);
            }),
          );
        } else {
          add(...(items.length ? items : [out("(empty directory)")]));
        }
      }
      break;
    }

    case "cat": {
      if (!args[0]) { add(err("cat: missing operand")); break; }
      const path = resolvePath(args[0]);
      const entry = FILESYSTEM[path];
      if (!entry) { add(err(`cat: ${args[0]}: No such file or directory`)); break; }
      if (entry.type === "dir") { add(err(`cat: ${args[0]}: Is a directory`)); break; }
      const lines = (entry.content || "").split("\n").map((l) => out(`  ${l}`));
      add(...lines, out(""));
      break;
    }

    case "cd": {
      const target = args[0] ? resolvePath(args[0]) : "/home/mahad";
      if (!FILESYSTEM[target] || FILESYSTEM[target].type !== "dir") {
        add(err(`cd: ${args[0]}: No such file or directory`));
      } else {
        cwd = target;
        // No output on successful cd (Unix convention)
        callbacks.setLogs([...currentLogs]);
      }
      break;
    }

    case "pwd": {
      add(out(cwd));
      break;
    }

    case "uname": {
      add(out("Linux kali 6.6.9-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.6.9-1kali1 (2026-01-15) x86_64 GNU/Linux"));
      break;
    }

    case "ifconfig": {
      add(
        out("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500"),
        out("        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255"),
        out("        ether 00:1a:2b:3c:4d:5e  txqueuelen 1000  (Ethernet)"),
        out(""),
        out("lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536"),
        out("        inet 127.0.0.1  netmask 255.0.0.0"),
        out(""),
        out("wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500"),
        out("        inet 10.0.0.42  netmask 255.255.255.0"),
        out("        ether aa:bb:cc:dd:ee:ff  txqueuelen 1000  (IEEE 802.11)"),
        out(""),
      );
      break;
    }

    case "ps": {
      add(
        out("  PID   TTY       STAT  TIME  COMMAND"),
        out("    1   ?         Ss    0:00  /sbin/init"),
        out("  420   ?         Ssl   1:23  /usr/bin/python3 exploit_scanner.py"),
        out("  666   ?         S     0:12  /usr/bin/metasploit-framework"),
        out(" 1337   pts/0     Ss    0:00  /bin/zsh"),
        out(" 2048   ?         Sl    0:45  portfolio --serve --port 3000"),
        out(" 3000   pts/0     R+    0:00  ps aux"),
        out(""),
      );
      break;
    }

    case "nmap": {
      const target = args[0] || "localhost";
      add(sys(`Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-06-06 14:00`));
      await new Promise((r) => setTimeout(r, 600));
      add(
        sys(`Nmap scan report for ${target}`),
        out(`Host is up (0.00034s latency).`),
        out(""),
        out("PORT     STATE    SERVICE    VERSION"),
        out("22/tcp   open     ssh        OpenSSH 9.6"),
        out("80/tcp   open     http       nginx 1.26.0"),
        out("443/tcp  open     ssl/https  nginx 1.26.0"),
        out("3000/tcp filtered node.js    Next.js Portfolio"),
        out("8080/tcp closed   http-alt"),
        out(""),
        out(`Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds`),
        out(""),
      );
      break;
    }

    case "sudo": {
      if (args[0] === "--override") {
        add(
          sys("╔══════════════════════════════════════════╗"),
          sys("║   SUDO OVERRIDE PROTOCOL — INITIATING   ║"),
          sys("╚══════════════════════════════════════════╝"),
          ok("  Bypassing authentication matrix..."),
          ok("  Injecting kernel-level credentials..."),
          ok("  ACCESS GRANTED — ROOT PRIVILEGES ACTIVE"),
          ok(""),
          ok("  ⚡ HACKER MODE UNLOCKED ⚡"),
          ok("  Navigate to your portfolio to see the effect."),
          out(""),
        );
        callbacks.activateHackerMode();
        break;
      }
      if (args[0] === "su") {
        const attempts = callbacks.getSudoAttempts();
        if (attempts === 0) {
          add(sys("[sudo] password for mahad: "), warn("Enter password (hint: it's not 'password')"));
          callbacks.setSudoAttempts(1);
        } else if (attempts === 1) {
          add(err("Sorry, try again."), sys("[sudo] password for mahad: "));
          callbacks.setSudoAttempts(2);
        } else if (attempts === 2) {
          add(
            err("sudo: 3 incorrect password attempts"),
            out(""),
            sys("╔══════════════════════════════════════╗"),
            sys("║  INTRUSION ALERT — LOGGED TO SYSLOG  ║"),
            sys("╚══════════════════════════════════════╝"),
            warn("  Incident ID: INC-2026-06-06-1337"),
            warn("  Your IP has been recorded: 192.168.1.77"),
            warn("  Security team notified."),
            out(""),
            ok("  (just kidding — try 'sudo --override' 😏)"),
            out(""),
          );
          callbacks.setSudoAttempts(0);
        }
        break;
      }
      add(err(`sudo: command not found: ${args.join(" ")}`));
      break;
    }

    case "curl": {
      const url = args[0] || "https://api.mahad.dev/intel";
      add(sys(`Fetching ${url}...`));
      await new Promise((r) => setTimeout(r, 400));
      add(
        out("{"),
        out('  "operator": "Syed Mahad Shah",'),
        out('  "clearance": "LEVEL-5",'),
        out('  "status": "ACTIVE",'),
        out('  "specializations": ["web_security", "ctf", "full_stack"],'),
        out('  "threat_level": "FRIENDLY",'),
        out('  "last_seen": "2026-06-06T14:00:00Z",'),
        out('  "contact": "mahadshahcr450@gmail.com"'),
        out("}"),
        out(""),
      );
      break;
    }

    case "history": {
      const fakeHistory = [
        "nmap -sV mahad.dev",
        "cat /etc/passwd",
        "sudo su",
        "python3 exploit.py --target localhost",
        "git clone https://github.com/mahadshah-cyber/portfolio",
        "npm run build",
        "ls -la /secrets",
        "cat /secrets/flag.txt",
      ];
      add(...fakeHistory.map((h, i) => out(`  ${String(i + 1).padStart(4)}  ${h}`)), out(""));
      break;
    }

    case "neofetch": {
      add(
        { text: "         .            mahad@kali-sec", type: "ascii" },
        { text: "        .'.           ------------------", type: "ascii" },
        { text: "       .'.'.          OS: Kali Linux x86_64", type: "ascii" },
        { text: "      .'.'.'.         Kernel: 6.6.9-amd64", type: "ascii" },
        { text: "     .'.'.'.'.        Shell: zsh 5.9", type: "ascii" },
        { text: "    .'.'.'.'.'.       Terminal: SecShell v4.26", type: "ascii" },
        { text: "       |   |          CPU: Intel Xeon @ 3.40GHz", type: "ascii" },
        { text: "       |   |          Memory: 16.4 GB / 32 GB", type: "ascii" },
        { text: "       |   |          Role: Cybersecurity Researcher", type: "ascii" },
        out(""),
      );
      break;
    }

    case "decrypt": {
      const payloads = [
        { plain: "SystemOverride",   hex: "53 79 73 74 65 6d 4f 76 65 72 72 69 64 65" },
        { plain: "AccessGranted",    hex: "41 63 63 65 73 73 47 72 61 6e 74 65 64" },
        { plain: "RootSecurity",     hex: "52 6f 6f 74 53 65 63 75 72 69 74 79" },
        { plain: "KaliLinux",        hex: "4b 61 6c 69 4c 69 6e 75 78" },
      ];
      const picked = payloads[Math.floor(Math.random() * payloads.length)];
      // Store answer in sessionStorage so terminal page can read it
      try { sessionStorage.setItem("decrypt-answer", picked.plain); } catch { /* ignore */ }
      add(
        sys("══════════════════════════════════════════"),
        err("🔒 ENCRYPTED DATA TRANSMISSION INTERCEPTED"),
        sys("══════════════════════════════════════════"),
        out(`CIPHER BUFFER (HEX):  ${picked.hex}`),
        out("TASK: Convert the hex bytes to plaintext ASCII."),
        warn("Enter decrypted plaintext below. Case-sensitive!"),
        out(""),
      );
      break;
    }

    case "matrix": {
      add(sys("DEPLOYING DIGITAL RAIN OVERLAY... click anywhere to exit"));
      setTimeout(() => callbacks.setMatrixActive(true), 400);
      break;
    }

    case "hack": {
      if (args[0] === "nasa") {
        callbacks.setHackNasaActive(true);
        break;
      }
      add(
        err("☣  PORT SCAN — LOCALHOST"),
        out("PORT 22    [SSH]   FILTERED"),
        out("PORT 80    [HTTP]  OPEN"),
        out("PORT 443   [HTTPS] OPEN"),
        out("PORT 3306  [MYSQL] OPEN — Attempting bruteforce..."),
        err("⚠  Intrusion countermeasures DEPLOYED"),
        ok("  (This site is secured by Syed Mahad Shah 😄)"),
        out(""),
      );
      break;
    }

    case "guitar": {
      add(
        { text: "     ♫ ♪  ASCII GUITAR SOLO  ♪ ♫", type: "success" },
        { text: "  |--0--0--0--0--|", type: "ascii" },
        { text: "  |--0-----0-----|", type: "ascii" },
        { text: "  |--0--0-----0--|", type: "ascii" },
        { text: "  |--0--0--0--0--|", type: "ascii" },
        { text: "  |--0-----0-----|", type: "ascii" },
        { text: "  |--0--0-----0--|", type: "ascii" },
        out("  🎸  E-A-D-G-B-E — Shredding in cyberpunk minor"),
        out(""),
      );
      break;
    }

    case "clear": {
      callbacks.setLogs([]);
      break;
    }

    case "exit": {
      add(
        sys("ABORTING SESSION..."),
        err("CONNECTION TERMINATED. REDIRECTING..."),
      );
      setTimeout(() => callbacks.routerPush("/"), 1000);
      break;
    }

    case "projects": {
      add(sys("QUERYING PROJECT DATABASE..."));
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const projs = data.projects || [];
        if (projs.length === 0) throw new Error("empty");
        add(
          ok(`✓ DATABASE DUMP — ${projs.length} records`),
          ...projs.map((p: { title: string; category: string; tech: string }, i: number) =>
            out(`  [${i + 1}] ${p.title.padEnd(28)} | ${p.category} | ${p.tech}`)
          ),
          out(""),
        );
      } catch {
        add(
          warn("Database offline. Serving cache:"),
          out("  [1] Portfolio Website     | Web      | Next.js, GSAP, Tailwind"),
          out("  [2] Security Auditor      | Security | Python, Bash, Nmap"),
          out("  [3] Encryption Suite      | Security | Java, AES-256, RSA"),
          out("  [4] Vulnerability Scanner | Security | Web Scanner, XSS, SQLi"),
          out(""),
        );
      }
      break;
    }

    case "ctf": {
      add(
        sys("══════════════════════════════════════════════"),
        ok("🚩 CTF ARENA — SOLVED CHALLENGE LOG"),
        sys("══════════════════════════════════════════════"),
        out("  Bandit 1-10 (OverTheWire)       [✓] Linux Shell"),
        out("  Basic SQLi (TryHackMe)           [✓] OWASP Web"),
        out("  Cryptography 101 (CTFlearn)      [✓] AES Cipher"),
        out("  Steganography (CTFlearn)         [✓] LSB Pixel"),
        out("  Reverse Engineering (TryHackMe)  [⏳] IDA Pro"),
        out("  Web Exploitation (picoCTF)       [⏳] CSRF/XSS"),
        out(""),
        ok("  SCORE: 850 pts  |  RANK: Top 30%  |  SOLVED: 4/8"),
        out(""),
      );
      break;
    }

    default: {
      if (!cmd) break;
      add(err(`bash: command not found: '${cmd}'  — Type 'help' for directives.`));
    }
  }
}
