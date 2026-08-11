  // ---------- Part Examinations — cross-chapter, exam-only questions ----------
  // These are DIFFERENT from the chapter quiz questions. They test the
  // connections between chapters in a part, in scenario form.
  // Keyed by part index (0..6).

  const PART_EXAMS = {

    // ============= Part I — The Foundations =============
    0: [
      {
        q: "Your CI runs <code>npm install</code> inside a Docker build step. Every commit — even a one-line source change — takes 3 minutes. What is the cleanest structural fix?",
        options: [
          "Use <code>npm install --production</code> to skip dev dependencies",
          "In the Dockerfile, <code>COPY package*.json ./</code> and <code>RUN npm ci</code> BEFORE copying the source, so the deps layer stays cached across code-only changes",
          "Upgrade to a newer Node base image",
          "Turn off Docker BuildKit",
        ],
        correct: 1,
        why: "Docker layers cache in order — a changed layer invalidates every layer below it. Copying deps first and source last is the canonical fix.",
      },
      {
        q: "You get paged: a container crash-loops with <em>permission denied</em> on <code>/var/log/app</code>. <code>docker exec</code> shows the process runs as <code>USER app</code> (uid 1000). Best fix?",
        options: [
          "Run the container as root",
          "Ensure the mounted path is owned/writable by uid 1000 — <code>chown 1000:1000</code> on the host volume, or fix ownership in an init container / entrypoint before the app starts",
          "Delete the log directory so the app creates a fresh one",
          "Rebuild the image without the USER line",
        ],
        correct: 1,
        why: "Non-root containers are the safer default; the operational cost is remembering to align volume ownership with the container's uid.",
      },
      {
        q: "A CI job runs <code>npm ci</code> and fails with 'package-lock.json is not in sync with package.json'. What did the last committer probably do?",
        options: [
          "The npm registry is down",
          "They edited <code>package.json</code> (added/removed a dep or changed a version range) without running <code>npm install</code> locally and committing the regenerated lockfile",
          "The lockfile is corrupted",
          "<code>npm ci</code> is deprecated",
        ],
        correct: 1,
        why: "That is exactly the divergence <code>npm ci</code> is designed to catch. It refuses to mutate the lockfile; it only installs from it.",
      },
      {
        q: "You need a systemd service to auto-restart on failure — but if it fails more than 3 times in 60 seconds, leave it in 'failed' state so alerting picks it up. Which directives?",
        options: [
          "<code>Restart=on-failure</code> + <code>StartLimitBurst=3</code> + <code>StartLimitIntervalSec=60s</code>",
          "<code>RestartAlways=true</code> + <code>MaxRestart=3</code>",
          "<code>Restart=always</code> + <code>Retry=3</code>",
          "systemd doesn't support that; use a wrapper script",
        ],
        correct: 0,
        why: "StartLimitBurst/IntervalSec is exactly the built-in circuit breaker for restart loops — flapping services stay 'failed' so operators see them.",
      },
      {
        q: "Which single Dockerfile change reduces both image size AND attack surface the most?",
        options: [
          "Add <code>RUN apt-get clean</code> at the end",
          "Multi-stage build: compile in a fat builder stage, <code>COPY --from=build</code> just the artifact into a slim (distroless or alpine) runtime image — the build toolchain never ships",
          "Compress the image tar",
          "Use the <code>:latest</code> tag on the base",
        ],
        correct: 1,
        why: "The build image can have compilers, package managers, source — the runtime image ships with none of it. Standard practice.",
      },
      {
        q: "A production Linux host is 100% CPU. You SSH in and want, in the fewest commands, to find (a) the top process, (b) whether it's stuck on I/O or actually running, (c) recent logs from that unit. Which sequence?",
        options: [
          "<code>ls /proc</code>, <code>ps -ef</code>, <code>grep</code>",
          "<code>top</code> (or <code>htop</code>) to see the top process and I/O wait, then <code>ps -p &lt;pid&gt; -o pid,cmd,%cpu,%mem</code>, then <code>journalctl -u &lt;unit&gt; -n 100</code>",
          "<code>systemctl status</code> alone",
          "<code>ss -tulpn</code>",
        ],
        correct: 1,
        why: "top/htop's wa% column tells you if it's CPU-bound or I/O-blocked; journalctl -u ties to the systemd unit. Four tools, 90% of triage.",
      },
    ],

    // ============= Part II — Networking & Access =============
    1: [
      {
        q: "Your API is behind nginx with TLS terminated at a public load balancer. EU users are fine; Asia sees intermittent 502s. Which cluster of causes is most worth investigating first?",
        options: [
          "DNS cache poisoning",
          "Backend timeouts / upstream keepalive exhaustion under the higher Asia→EU RTT — especially if <code>proxy_read_timeout</code> is low and upstream keepalive isn't tuned",
          "Certificate expiry",
          "The bastion host is misconfigured",
        ],
        correct: 1,
        why: "502 from a proxy almost always means the upstream failed or timed out. Latency-sensitive tuning of proxy_read_timeout and upstream keepalive is the first fix.",
      },
      {
        q: "You migrate a domain from Cloudflare DNS to Route 53. TTL is set to 3600. Some users still resolve to the old IP 90 minutes later. Best explanation?",
        options: [
          "Route 53 is down",
          "Resolvers along the chain are still holding cached records; TTL is the upper bound, but delegation change propagation, ISP resolvers' internal minimums and client stub caches all lengthen the tail",
          "The migration silently failed",
          "IPv6 is disabled",
        ],
        correct: 1,
        why: "Cutovers are propagation exercises. Lower TTL a day BEFORE the change; raise it back after everything's stable.",
      },
      {
        q: "A workload in a private subnet must reach the S3 API but nothing else on the internet. Cheapest, safest design?",
        options: [
          "Move it to a public subnet",
          "Stay in private subnet. Add a <em>VPC Gateway endpoint</em> for S3 — traffic routes over AWS's private network, no NAT hop, no NAT egress cost, no public exposure",
          "Give it a public Elastic IP",
          "Route through a bastion",
        ],
        correct: 1,
        why: "VPC endpoints (Gateway for S3/DynamoDB, Interface for most others) both save money and eliminate the internet round-trip.",
      },
      {
        q: "You need SSH access to a private EC2 instance urgently. There's no bastion, but you have IAM admin. Simplest and safest tool?",
        options: [
          "Temporarily give the instance a public IP + open 22 in the SG",
          "<code>aws ssm start-session --target i-abc</code> — IAM-authenticated, no inbound port opened, session logged to CloudWatch, works for port-forwarding too",
          "Set up a full VPN",
          "Bake your key into a new AMI",
        ],
        correct: 1,
        why: "SSM Session Manager is the modern default. Zero attack surface, IAM-only auth, an audit trail per session.",
      },
      {
        q: "A user reports 'certificate expired' warnings on your site, but <code>openssl s_client</code> from a monitoring host shows the cert valid for another 60 days. Most likely explanation?",
        options: [
          "The user's clock is skewed OR their client is stuck on a stale intermediate/trust path OR you have a load balancer node still presenting an old cert on one IP",
          "The domain has been revoked",
          "TLS is broken globally",
          "The user's ISP is blocking HTTPS",
        ],
        correct: 0,
        why: "Cert issues on 'some clients' are almost always trust-store, intermediate, or partial-rollout problems, not the visible leaf cert.",
      },
      {
        q: "You want to remove the 'ex-employee still has SSH keys everywhere' class of problem entirely. Best single change?",
        options: [
          "Rotate everyone's password",
          "Adopt short-lived SSH certificates (Vault SSH engine, Teleport, Smallstep) — human authenticates to an SSO/IdP, gets a cert valid for an hour; no persistent authorised_keys",
          "Only allow SSH from the office IP",
          "Enable MFA on the bastion only",
        ],
        correct: 1,
        why: "Short-lived certs make offboarding a solved problem: the cert expires whether you remembered to revoke or not.",
      },
      {
        q: "Between a classic bastion, AWS SSM Session Manager, Google IAP, and Tailscale — which factor most drives the choice today?",
        options: [
          "Cost",
          "Who your identity provider is and where your workloads live: SSM/IAP integrate with the cloud's own IAM (no extra vendor); Tailscale/Teleport add strong SSO + audit across clouds and on-prem; classic bastion is chosen mainly by inertia",
          "Latency",
          "Which OS you run",
        ],
        correct: 1,
        why: "All four remove the 'open port 22 to the internet' problem. The choice is about identity, audit, and where your fleet actually lives.",
      },
    ],

    // ============= Part III — Orchestration & GitOps =============
    2: [
      {
        q: "A K8s Deployment declares <code>replicas: 3</code>. Three Pods are Running but only two receive traffic through the Service. Most likely?",
        options: [
          "The cluster is broken",
          "The third Pod fails its readiness probe — Services only route to Pods present in the endpoints list, and readiness gates that list. The Pod is alive but excluded until it passes",
          "The Service selector doesn't match",
          "kube-proxy is down",
        ],
        correct: 1,
        why: "This is one of the most common K8s puzzles. <code>kubectl describe pod</code> or the endpoints list confirms it fast.",
      },
      {
        q: "You want a bad Helm release to auto-rollback in CI if it doesn't reach Ready within 5 minutes. Which flags?",
        options: [
          "<code>helm install --force</code>",
          "<code>helm upgrade --install &lt;release&gt; &lt;chart&gt; --atomic --wait --timeout 5m</code>",
          "<code>helm rollback --auto</code>",
          "<code>helm apply --dry-run</code>",
        ],
        correct: 1,
        why: "--atomic waits for Ready, rolls back on failure. --install makes the same command work for first install and every upgrade. This is the canonical CI incantation.",
      },
      {
        q: "Your ArgoCD Application is <code>OutOfSync</code> because someone <code>kubectl edit</code>-ed the Deployment directly. Your syncPolicy has <code>automated.selfHeal: true</code>. What happens?",
        options: [
          "Nothing — Argo waits for a manual sync",
          "Argo re-applies Git's manifest, reverting the manual edit. This is exactly the point of self-heal: Git is source of truth, drift is transient",
          "Argo deletes the namespace",
          "The cluster crashes",
        ],
        correct: 1,
        why: "Which is also why 'kubectl edit on prod' becomes a smell in a GitOps shop: the change won't stick.",
      },
      {
        q: "You made three WIP commits ('wip', 'fix typo', 'actually working now') on a feature branch. Best way to publish a clean history?",
        options: [
          "<code>git push --force</code> and hope",
          "<code>git rebase -i main</code> — squash the fix-typo into its parent, reword the WIPs, drop debug commits — then push. Reviewer sees intent, not the sausage-making",
          "<code>git revert</code>",
          "<code>git cherry-pick</code>",
        ],
        correct: 1,
        why: "Interactive rebase before pushing is the polite thing to do to reviewers. Rebase your own private branch; never rebase shared branches.",
      },
      {
        q: "In a service mesh with mTLS on by default, service A gets 403 calling service B after a policy change. Where is the authoritative signal about which identity was rejected?",
        options: [
          "Kernel logs on the node",
          "The mesh's authorization/access logs — Istio's Envoy access logs and AuthorizationPolicy denials, or Linkerd's tap/viz. Both surface the client identity presented and the policy that denied",
          "Application stdout",
          "DNS logs",
        ],
        correct: 1,
        why: "Every hop is identity-authenticated in a mesh; the mesh knows exactly who tried what. That's a big part of its value.",
      },
      {
        q: "You canary v2 via the mesh at 10%; v2 spikes 500s. Fastest safe recovery?",
        options: [
          "Roll the whole cluster back",
          "Set the traffic split to 100% v1, 0% v2 in the VirtualService / HTTPRoute — takes effect in seconds, no redeploy, no rollback of Deployments needed",
          "Delete v2 Pods",
          "Disable the mesh",
        ],
        correct: 1,
        why: "That's the whole point of mesh-driven canarying: change traffic weights without touching workload manifests.",
      },
      {
        q: "You <code>git reset --hard</code> a branch and immediately realise you lost 20 minutes of work. First move?",
        options: [
          "Restore from a filesystem backup",
          "<code>git reflog</code> to find the SHA of the last commit before the reset, then <code>git reset --hard &lt;sha&gt;</code> to recover",
          "Rewrite from memory",
          "Nothing can be done",
        ],
        correct: 1,
        why: "reflog entries persist for 90 days by default. As long as you committed at least once, you can recover.",
      },
    ],

    // ============= Part IV — Infrastructure & Cloud =============
    3: [
      {
        q: "Two engineers run <code>terraform apply</code> against the same state at the same time. With a properly configured remote backend, what happens?",
        options: [
          "Both succeed and state is merged",
          "The backend's state lock (DynamoDB with S3, or Terraform Cloud's built-in lock) blocks the second — it either waits or fails cleanly. Without locking, they would corrupt state",
          "The cluster crashes",
          "They see each other's plans in real time",
        ],
        correct: 1,
        why: "This is why the S3+DynamoDB pattern is canonical. Skipping the lock table works — right up until two people apply at once.",
      },
      {
        q: "You need to bring a pre-existing S3 bucket (created by hand in the console) under Terraform management, WITHOUT destroying and recreating it. Flow?",
        options: [
          "<code>terraform destroy</code> then <code>terraform apply</code>",
          "Write the matching HCL, then <code>terraform import aws_s3_bucket.logs my-bucket-name</code>. Re-run <code>plan</code>: it should show no changes if the HCL matches reality",
          "<code>terraform refresh</code> alone",
          "<code>terraform state new</code>",
        ],
        correct: 1,
        why: "Import writes the resource into state; your HCL must then describe it accurately. Iterate on HCL until plan is clean.",
      },
      {
        q: "You want an Ansible playbook to restart nginx <em>only</em> if a config template actually rendered a change. Which mechanism?",
        options: [
          "Unconditionally <code>command: systemctl restart nginx</code> after the template task",
          "A <em>handler</em> notified by the template task. The handler runs at the end of the play, and only if the notifying task reported <code>changed=true</code>",
          "A <code>when: config_changed</code> conditional",
          "Ansible can't do that",
        ],
        correct: 1,
        why: "Handlers are the idiomatic Ansible way. Bonus: they de-duplicate — even if ten templates notify the same handler, it runs once.",
      },
      {
        q: "For a private-subnet EC2 instance that must write to an S3 bucket, most modern-safest credential design?",
        options: [
          "Put an access key in <code>~/.aws/credentials</code> on the instance",
          "Attach an IAM instance profile (role). SDKs pick up short-lived credentials automatically via IMDSv2 — no static keys anywhere, and rotation is a non-issue",
          "Set env vars in userdata",
          "Use a shared root credential",
        ],
        correct: 1,
        why: "Static credentials on hosts are the classic breach vector. Instance profiles are one of the best free security wins in AWS.",
      },
      {
        q: "You want a K8s ServiceAccount to read AWS Secrets Manager, without any long-lived credentials in the cluster. Which mechanism?",
        options: [
          "Mount an access key as a Secret",
          "IRSA (IAM Roles for Service Accounts) — bind the SA to an IAM role via the cluster's OIDC provider; workloads get short-lived STS credentials automatically. GKE Workload Identity and Azure Managed Identity are the equivalents",
          "SSH keys",
          "A shared Kubernetes Secret named <code>aws-creds</code>",
        ],
        correct: 1,
        why: "Cross-ref: [[rbac]]. Workload identity is the answer every cloud converges on.",
      },
      {
        q: "You have a Terraform module creating IAM users from a list. A teammate reorders the list. What happens on next apply, and how do you prevent it?",
        options: [
          "Nothing changes",
          "With <code>count</code>, resources are keyed by index — reordering renames every user and Terraform destroys+recreates them. Prevent this by using <code>for_each = toset(list)</code>, which keys by value",
          "Terraform always errors",
          "All users are deleted",
        ],
        correct: 1,
        why: "Rule of thumb: <code>count</code> for 'N copies of the same thing', <code>for_each</code> for 'a set of distinct named things'. Almost always for_each.",
      },
      {
        q: "You're designing for multi-AZ resilience in a single region. Which pair of choices matters most to actually be tolerant of one AZ failing?",
        options: [
          "Larger instances + more RAM",
          "Workloads across ≥ 2 AZs AND the database Multi-AZ (or an equivalent primary+standby / synchronous replica). One without the other doesn't help — a stateless fleet is useless if the DB is single-AZ",
          "A separate account per AZ",
          "Reserve instances in one AZ",
        ],
        correct: 1,
        why: "Multi-AZ is a whole-system property. Any single-AZ dependency (DB, cache, secret store) is the actual limit of your resilience.",
      },
    ],

    // ============= Part V — Data, Applications & Security =============
    4: [
      {
        q: "Your Postgres primary is at 3000 connections and slow. Adding replicas doesn't help. Highest-leverage change?",
        options: [
          "Move to a bigger instance",
          "Put PgBouncer in transaction-pooling mode in front — thousands of app connections funnel through ~20 real Postgres backends. Primary goes from thrashing to comfortable",
          "Downgrade Postgres",
          "Increase <code>max_connections</code> to 5000",
        ],
        correct: 1,
        why: "Every Postgres backend is a real process with real RAM. PgBouncer solves the class of problem, not the specific instance size.",
      },
      {
        q: "You must publish an event to Kafka whenever an order is created, without losing it if the app crashes between the DB commit and the publish. Which pattern?",
        options: [
          "Wrap the publish in try/except",
          "The outbox pattern: write the business row and an <code>outbox</code> row in the same DB transaction; a separate worker reads unpublished outbox rows and publishes to Kafka, deleting on ack",
          "Retries with backoff on the publish",
          "Use SQS instead",
        ],
        correct: 1,
        why: "This is the canonical fix to the dual-write problem. Local transaction is atomic; the worker makes the publish eventually consistent but reliable.",
      },
      {
        q: "A dashboard is slow because it fetches 500 users' details each load. You put Redis with a 5-minute TTL in front. Cold cache still hammers the DB when many tabs open at once. Minimal fix?",
        options: [
          "Increase the TTL to 1 hour",
          "Add request coalescing / single-flight: on a miss, the first request recomputes and populates cache; concurrent requests for the same key wait on that in-flight computation. Kills cache stampedes",
          "Delete Redis and go straight to DB",
          "Return stale data indefinitely",
        ],
        correct: 1,
        why: "Also called 'thundering herd' protection. Every serious cache library or reverse proxy (Varnish, nginx, Fastly) has a version of this.",
      },
      {
        q: "Which cookie flag combination best defends against CSRF <em>and</em> stolen-cookie XSS at once?",
        options: [
          "<code>HttpOnly</code> alone",
          "<code>HttpOnly; Secure; SameSite=Lax</code> (or Strict). HttpOnly blocks JS reads (XSS-stolen cookies), Secure requires HTTPS, SameSite blocks cross-site sends (CSRF)",
          "<code>Path=/</code> only",
          "<code>Domain=.example.com</code> alone",
        ],
        correct: 1,
        why: "One line of config removes most of the OWASP top-10 attacks against sessions. Not a substitute for CSRF tokens on high-value endpoints.",
      },
      {
        q: "You publish an image and reference it across dev, staging, and prod. Which convention prevents drift between environments?",
        options: [
          "Tag every build as <code>latest</code>",
          "Tag as an immutable version (<code>api:1.4.2</code>) and reference by digest (<code>@sha256:...</code>) — no moving pointer; every environment pulls the same bytes",
          "Rebuild in each environment",
          "Rely on image caches",
        ],
        correct: 1,
        why: "The whole point of 'immutable artifacts': what passed in staging <em>is</em> what runs in prod.",
      },
      {
        q: "You call an external API from a worker. It has 99% uptime — 1% of calls fail. Minimum resilience pattern?",
        options: [
          "Log and forget",
          "Timeout + retry with exponential backoff + jitter, and open a circuit breaker if the failure rate stays high. Send an <code>Idempotency-Key</code> on writes so retries are safe",
          "Retry forever",
          "Assume it always works",
        ],
        correct: 1,
        why: "Timeout, retry+backoff+jitter, circuit breaker, idempotency — the four patterns that turn a fragile RPC caller into a resilient distributed component.",
      },
      {
        q: "You're storing an OAuth refresh token in your app database. Best storage design?",
        options: [
          "Plaintext column",
          "Encrypted at rest with an app-level data key; the master key lives in a KMS or secrets manager (Vault / AWS Secrets Manager / SOPS-encrypted config). Envelope encryption, rotatable",
          "Base64-encoded",
          "As an environment variable committed to git",
        ],
        correct: 1,
        why: "Cross-ref: [[secrets]]. Envelope encryption gives you rotation, per-record access logging, and clean separation of duties.",
      },
    ],

    // ============= Part VI — Observability =============
    5: [
      {
        q: "Prometheus is out of memory. <code>topk(10, count by (__name__)({...}))</code> shows some metrics have 5M+ series. Root cause?",
        options: [
          "Prometheus is under-provisioned",
          "A high-cardinality label — <code>user_id</code>, <code>request_id</code>, or a full URL path — on a busy metric. Millions of unique label combinations = millions of series. Move that data to logs or traces",
          "Scrape interval is too high",
          "Local disk is slow",
        ],
        correct: 1,
        why: "Labels are for classifying (service, env, method, status). IDs belong in [[logs]] or [[traces]].",
      },
      {
        q: "A P99 latency alert is flapping every 3 minutes and on-call has learned to ignore it. Best fix?",
        options: [
          "Delete the alert",
          "Switch to an SLO burn-rate alert — page when the error budget is burning fast enough to matter (e.g., 1h of budget in 5m). Add a <code>for: 5m</code> to require the condition to persist. Fewer, more meaningful pages",
          "Page harder",
          "Set the raw threshold higher",
        ],
        correct: 1,
        why: "Alert on symptoms users care about, on time-scales that match human response. The Google SRE Workbook chapter on this is required reading.",
      },
      {
        q: "You want to correlate a metric spike in Grafana to the exact trace that caused it, in one click. Which feature makes this a native flow?",
        options: [
          "Dashboard variables",
          "Exemplars — histograms carry pointers to specific traces that contributed to a bucket. Click the P99 spike, land on the trace with the actual slow span",
          "Annotations",
          "Alerts",
        ],
        correct: 1,
        why: "One of the most impactful things to enable in OpenTelemetry. Instantly closes the metrics→traces loop during incidents.",
      },
      {
        q: "Your app emits OpenTelemetry metrics and traces. You send them to Grafana Cloud today but want the option to switch to Datadog later. What's the decoupling move?",
        options: [
          "Instrument twice, once per vendor",
          "Emit OTLP from the app. Run an OTel Collector or Grafana Alloy that fans out to any destination — flip the config, not the code",
          "Hard-code Grafana endpoints in the SDK",
          "You can't decouple",
        ],
        correct: 1,
        why: "That's OTel's whole promise: instrument once, ship anywhere. The Collector/Alloy is the flexibility layer.",
      },
      {
        q: "Structured logs contain a JSON body with <code>user_id</code>. You want a Grafana alert when a specific user hits errors > 3 times in 5 minutes. Which layer?",
        options: [
          "Prometheus alerting",
          "Grafana Alerting on a LogQL query. Something like <code>sum by (user_id) (rate({app=\"api\", level=\"error\"} | json [5m])) &gt; 0.01</code> — extract user_id at query time from the JSON body",
          "A cron job",
          "The application must alert itself",
        ],
        correct: 1,
        why: "This is why Loki's label-body split matters: high-cardinality dimensions live in the body and become queryable via <code>| json</code>.",
      },
      {
        q: "Head sampling drops 95% of traces at the SDK. Your team can't find slow traces because they're sampled out. Fix?",
        options: [
          "Turn off tracing",
          "Switch to tail sampling in an OTel Collector — buffer each trace, keep it if it errored or exceeded a latency threshold, plus a small % of normal ones",
          "Sample less aggressively (e.g., 10%)",
          "Add more RAM to the SDK",
        ],
        correct: 1,
        why: "Head sampling is efficient but blind. Tail sampling costs Collector memory to buffer, but keeps every interesting trace.",
      },
      {
        q: "Your engineering director wants ONE dashboard answering 'is our system healthy?'. Which panel set best answers that?",
        options: [
          "Every metric you have, on one dashboard",
          "The four golden signals per critical service (traffic, errors, latency, saturation) plus current SLO burn rate. Nothing more — deliberately",
          "A raw log tail",
          "A trace list",
        ],
        correct: 1,
        why: "A dashboard that shows everything shows nothing. Focus is a design decision.",
      },
    ],

    // ============= Part VII — AI Interfaces =============
    6: [
      {
        q: "You want to expose your internal Jira to an AI assistant so it can read tickets and add comments — but nothing else. What's the right primitive?",
        options: [
          "Give the assistant your Jira credentials directly",
          "Run an MCP server that exposes only two tools (<code>list_tickets</code>, <code>add_comment</code>) with typed schemas. The model can only invoke those, the server's own token is scoped and auditable",
          "Grant admin OAuth to the assistant",
          "Screen-scrape",
        ],
        correct: 1,
        why: "MCP is the answer to 'how do I expose capability without exposing credentials?' Cross-ref: [[rbac]] — the surface you expose is what defines the risk.",
      },
      {
        q: "When should an MCP server expose something as a <em>resource</em> vs a <em>tool</em>?",
        options: [
          "Everything should be a tool",
          "<em>Resource</em>: read-only content the model may reference (files, wiki pages, DB rows) addressed by URI. <em>Tool</em>: a function the model actively invokes with typed parameters and consequences. Same distinction as a URL vs an API endpoint",
          "They are the same thing",
          "Only tools work in practice",
        ],
        correct: 1,
        why: "Resources are surfaced as context; tools are invoked with side effects. Design the boundary carefully — that's where authorization lives.",
      },
      {
        q: "You add an MCP server that lets an assistant run <code>kubectl</code> against production. Minimum safety hardening?",
        options: [
          "Trust the assistant",
          "Bind the MCP server's kubeconfig to a scoped RBAC role (read-only, or a narrowly-permitted role). Require explicit confirmation for mutating verbs. Log every tool invocation to an audit sink. Cross-ref: [[rbac]]",
          "Nothing — MCP is inherently safe",
          "Turn off MCP",
        ],
        correct: 1,
        why: "Everything you know about least-privilege applies here. The MCP server is a principal with a role; give it the smallest one that works.",
      },
      {
        q: "Deciding between stdio and streamable-HTTP transport for a new MCP server. Which factor most points to HTTP?",
        options: [
          "Speed",
          "You want the server as a long-lived shared service (with OAuth) across many users and clients, instead of a per-session subprocess launched by each client. HTTP fits; stdio doesn't",
          "Simplicity of debugging",
          "Cross-platform support",
        ],
        correct: 1,
        why: "stdio is great for local, per-session tools; streamable HTTP is for multi-user, always-on servers. Different deployment models.",
      },
      {
        q: "Which analogy best explains why MCP has spread so fast?",
        options: [
          "It's the fastest protocol",
          "It's the LSP moment for LLM tool-use: implement one MCP server for your service, and every MCP-aware client (Claude Desktop, Claude Code, Cursor, Zed…) can use it. No per-client integration",
          "It replaced HTTP",
          "It's paid and enterprise-only",
        ],
        correct: 1,
        why: "Standards compound. One implementation, many clients — exactly what LSP did for editor+language pairs.",
      },
    ],

  };
