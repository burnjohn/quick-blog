# Security Skill — References and Sources

All sources used to build this security skill, organized by category.

---

## OWASP Official Resources

### OWASP Top 10:2025
- **Official page**: https://owasp.org/Top10/2025/en/
- **Introduction**: https://owasp.org/Top10/2025/0x00_2025-Introduction/
- **What's new in 2025**:
  - A03 expanded to "Software Supply Chain Failures" (was "Injection" at #3)
  - A10 is new: "Mishandling of Exceptional Conditions" (24 CWEs)
  - Broken Access Control remains #1
  - Security Misconfiguration moved from #5 to #2

### OWASP Top 10 2025 Categories

| # | Category | CWEs | % Apps Affected |
|---|----------|------|-----------------|
| A01 | Broken Access Control | 40 | 3.73% |
| A02 | Security Misconfiguration | 16 | 3.00% |
| A03 | Software Supply Chain Failures | 5 | New |
| A04 | Cryptographic Failures | 32 | 3.80% |
| A05 | Injection | 38 | — |
| A06 | Insecure Design | — | — |
| A07 | Authentication Failures | 36 | — |
| A08 | Software/Data Integrity Failures | — | — |
| A09 | Security Logging & Alerting Failures | 5 | — |
| A10 | Mishandling of Exceptional Conditions | 24 | New |

### ASVS 5.0 (Application Security Verification Standard)
- **Official project**: https://owasp.org/www-project-application-security-verification-standard/
- Three verification levels: L1 (all apps), L2 (sensitive data), L3 (critical systems)

### OWASP Agentic AI Security (2026)
- 10 risk categories for AI-powered applications (ASI01–ASI10)
- Covers prompt injection, tool misuse, identity abuse, supply chain, code execution, memory poisoning, inter-agent comms, cascading failures, human-agent trust, rogue agents

---

## Community Security Skills — Sources

### Sentry Security Review Skill (Recommended Winner)
- **Repository**: https://github.com/getsentry/skills
- **Path**: `plugins/sentry-skills/skills/security-review/SKILL.md`
- **Key innovation**: Confidence-based reporting (HIGH/MEDIUM/LOW) to eliminate false positives
- **Approach**: Trace data flow before flagging, understand framework mitigations
- **Coverage**: 17 vulnerability reference guides, Python/JS/Go/Rust/Java, infrastructure

### agamm OWASP Security Skill
- **Repository**: https://github.com/agamm/claude-code-owasp
- **Key innovation**: OWASP Top 10:2025 + ASVS 5.0 + Agentic AI security in one skill
- **Coverage**: 20+ language-specific security quirks with unsafe/safe code pairs
- **Install**: `curl -sL https://raw.githubusercontent.com/agamm/claude-code-owasp/main/.claude/skills/owasp-security/SKILL.md -o .claude/skills/owasp-security/SKILL.md --create-dirs`

### Trail of Bits Security Skills
- **Repository**: https://github.com/trailofbits/skills
- **Key innovation**: Professional-grade audit tooling (24 skills)
- **Notable skills**:
  - `static-analysis` — CodeQL, Semgrep, SARIF integration
  - `insecure-defaults` — Detect hardcoded credentials, fail-open patterns
  - `differential-review` — Security-focused diff review with git history
  - `supply-chain-risk-auditor` — Dependency threat landscape audit
  - `variant-analysis` — Find similar vulnerabilities across codebases
  - `sharp-edges` — Error-prone APIs and dangerous configurations
  - `constant-time-analysis` — Timing side-channels in crypto code
- **Achievement**: Found timing side-channel in RustCrypto/signatures using their tools

### Transilience AI Community Tools
- **Repository**: https://github.com/transilienceai/communitytools
- **Key innovation**: Full pentest lifecycle (23 skills, 8 agents, 2 tool integrations)
- **Notable skills**: `/injection`, `/client-side`, `/server-side`, `/authentication`, `/api-security`, `/source-code-scanning`
- **Agents**: Pentester Orchestrator, Executor, Validator

### Anthropic Cybersecurity Skills
- **Repository**: https://github.com/mukul975/Anthropic-Cybersecurity-Skills
- **Coverage**: 754 structured skills mapped to 5 frameworks (MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, D3FEND, NIST AI RMF)

### Awesome Claude Skills Security
- **Repository**: https://github.com/Eyadkelleh/awesome-claude-skills-security
- **Focus**: SecLists wordlists, injection payloads, security testing agents

---

## Review Articles and Analysis

### TimOnWeb: Security Skills Comparison
- **URL**: https://timonweb.com/ai/i-checked-5-security-skills-for-claude-code-only-one-is-worth-installing/
- **Finding**: Sentry's `security-review` was the only skill worth installing
- **Criteria**: Confidence-based reporting, framework awareness, data flow tracing
- **Skills reviewed**: sickn33/antigravity, affaan-m/everything-claude-code, sergiodxa/agent-skills, alirezarezvani/claude-skills, davila7/claude-code-templates

### Snyk: Top 9 Claude Security Skills
- **URL**: https://snyk.io/articles/top-claude-skills-cybersecurity-hacking-vulnerability-scanning/
- **Warning**: "Prompt injection found in 36% of skills tested" — always review SKILL.md before installing
- **Top picks**: Trail of Bits, Snyk Fix, Claude Code OWASP

### Hardening Claude Code (Security Review Framework)
- **URL**: https://medium.com/@emergentcap/hardening-claude-code-a-security-review-framework-and-the-prompt-that-does-it-for-you-c546831f2cec

### CSA: Secure Vibe Coding with Cursor Rules
- **URL**: https://cloudsecurityalliance.org/blog/2025/05/06/secure-vibe-coding-level-up-with-cursor-rules-and-the-r-a-i-l-g-u-a-r-d-framework
- **Framework**: R.A.I.L.G.U.A.R.D. for securing AI-assisted development

### OWASP Top 10 2025 Developer Guide
- **URL**: https://www.aikido.dev/blog/owasp-top-10-2025-changes-for-developers
- **Focus**: What changed and what developers should know

---

## Cursor Security Resources

### Cursor Security Rules Repository
- **Repository**: https://github.com/matank001/cursor-security-rules
- **Coverage**: Safe coding practices, sensitive operation control, AI agent risk reduction

### Cursor Directory: Security Rules
- **URL**: https://cursor.directory/rules/security
- **Collection**: Community-contributed security-focused cursor rules

### Cursor Security Complete Guide
- **URL**: https://www.mintmcp.com/blog/cursor-security
- **Coverage**: Risks, vulnerabilities, and best practices

### Cursor Security Risks (CVEs)
- **URL**: https://ship-safe.co/blog/cursor-security-risks
- **Notable CVE**: CurXecute (CVE-2025-54135) — malicious Slack messages could rewrite MCP config

---

## Additional Community Resources

### Everything Claude Code
- **Repository**: https://github.com/affaan-m/everything-claude-code
- **Security guide**: https://github.com/affaan-m/everything-claude-code/blob/main/the-security-guide.md
- **Coverage**: Skills, instincts, memory, security for Claude Code

### Awesome Agent Skills
- **Repository**: https://github.com/VoltAgent/awesome-agent-skills
- **Coverage**: 1000+ agent skills from official dev teams and community

### Awesome Claude Code
- **Repository**: https://github.com/hesreallyhim/awesome-claude-code
- **Coverage**: Skills, hooks, slash-commands, agent orchestrators, plugins

### Claude Code Security Documentation
- **Official**: https://code.claude.com/docs/en/security

---

## Stack-Specific Security Documentation

### Express.js
- **Security best practices**: https://expressjs.com/en/advanced/best-practice-security.html
- **Helmet.js**: https://helmetjs.github.io/
- **express-rate-limit**: https://www.npmjs.com/package/express-rate-limit
- **CORS**: https://www.npmjs.com/package/cors

### React
- **Security**: https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
- **DOMPurify**: https://github.com/cure53/DOMPurify

### MongoDB / Mongoose
- **Security checklist**: https://www.mongodb.com/docs/manual/administration/security-checklist/
- **Injection prevention**: https://www.mongodb.com/docs/manual/faq/fundamentals/#how-does-mongodb-address-sql-or-query-injection-
- **Mongoose validation**: https://mongoosejs.com/docs/validation.html

### JWT
- **RFC 7519**: https://datatracker.ietf.org/doc/html/rfc7519
- **JWT best practices (RFC 8725)**: https://datatracker.ietf.org/doc/html/rfc8725
- **jsonwebtoken npm**: https://www.npmjs.com/package/jsonwebtoken

### bcrypt
- **bcryptjs**: https://www.npmjs.com/package/bcryptjs
- **OWASP password storage**: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

### Vite
- **Env variables and modes**: https://vite.dev/guide/env-and-mode.html
- **Security note**: All `VITE_` prefixed vars are exposed to client bundle

---

## CVE Databases and Security Tools

### Vulnerability Databases
- **NVD (National Vulnerability Database)**: https://nvd.nist.gov/
- **CVE.org**: https://www.cve.org/
- **GitHub Advisory Database**: https://github.com/advisories
- **Snyk Vulnerability Database**: https://snyk.io/vuln/

### SAST (Static Analysis) Tools
- **SonarQube**: Open source + commercial, 75% detection rate
- **Checkmarx**: Commercial, 85% detection rate
- **Semgrep**: Open source, rule-based pattern matching
- **CodeQL**: GitHub's query language for code analysis

### DAST (Dynamic Analysis) Tools
- **OWASP ZAP**: Open source, free, 70% detection rate
- **Burp Suite**: Freemium ($400-$5K/year), 82% detection rate

### Dependency Scanning
- **npm audit**: Built into npm CLI
- **Snyk**: SCA + SAST with automated remediation
- **Socket.dev**: Supply chain security for npm

---

## OWASP Cheat Sheets (Quick References)

- **Authentication**: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- **Authorization**: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- **Input Validation**: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- **XSS Prevention**: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- **SQL Injection Prevention**: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- **CSRF Prevention**: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- **JWT Security**: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- **File Upload**: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- **Logging**: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- **Error Handling**: https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html
- **REST Security**: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- **Password Storage**: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

---

## Notable CVEs Relevant to This Stack

| CVE | Component | Impact |
|-----|-----------|--------|
| CVE-2025-59536 | Claude Code | Project code executing before trust dialog |
| CVE-2026-21852 | Claude Code | API traffic redirect via ANTHROPIC_BASE_URL |
| CVE-2025-54135 | Cursor (CurXecute) | MCP config rewrite via malicious Slack messages |
| Prototype Pollution | Various npm packages | Object injection via `__proto__` |
| ReDoS | User-provided regex | Denial of service via catastrophic backtracking |

---

*Last updated: April 2026. Review and update these references quarterly.*
