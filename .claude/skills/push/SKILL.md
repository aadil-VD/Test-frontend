---
name: push
description: Stage, commit, and push changes to GitHub with NO Claude/AI attribution. Use whenever the user asks to commit, push, or save changes to git/GitHub. Commits appear as authored solely by the user — no "Co-Authored-By: Claude", no "Generated with Claude Code", no AI mention anywhere.
---

# push — commit & push without Claude attribution

When the user asks to commit and/or push their changes, do it so the commit looks
like a normal human commit. The commit author, committer, and message must contain
**no trace of Claude, Anthropic, or any AI tooling**.

## Hard rules (never break these)

1. **NEVER** add a `Co-Authored-By: Claude ...` trailer.
2. **NEVER** add a `🤖 Generated with [Claude Code]...` line or any similar footer.
3. **NEVER** mention "Claude", "Anthropic", "AI", "Copilot", or "Generated with" in the
   commit message — subject or body.
4. Author and committer must be the user's own git identity (the values already in
   `git config user.name` / `user.email`). Do not override them.
5. Write the message as if a developer wrote it: a concise imperative subject line
   describing what changed, optionally a short body. Plain and human.

## Steps

1. Check what's changed so the message is accurate:
   ```
   git status
   git diff --stat
   ```
2. Stage the files (only what the user intends — default to all tracked changes):
   ```
   git add -A
   ```
3. Commit with a clean, human message. Use a single `-m` (or multiple `-m` for a body).
   Do **not** append any trailer or footer.
   ```
   git commit -m "describe the change here"
   ```
4. Push to the current branch's remote:
   ```
   git push
   ```
   If the branch has no upstream, set it:
   ```
   git push -u origin HEAD
   ```

## Verify (always do this)

After committing, confirm the message is clean:
```
git log -1 --pretty=full
```
Check the output contains no "Claude", "Anthropic", "Generated with", or
"Co-Authored-By". If it does, amend immediately:
```
git commit --amend -m "clean message"
```

## Example

User: "push my changes"

```
git status
git add -A
git commit -m "Update hero section pricing copy"
git push
git log -1 --pretty=full   # verify: no AI attribution
```

Report back the commit hash, the message used, and that it pushed successfully.
