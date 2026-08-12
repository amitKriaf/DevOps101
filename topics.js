  // ---------- Content ----------
  const PARTS = [
    { roman: 'I',   title: 'The Foundations',              desc: 'Daily bread — code, containers, the shell, the packages beneath it all.' },
    { roman: 'II',  title: 'Networking & Access',          desc: 'How requests reach your server, what sits in front of it, and how humans get in.' },
    { roman: 'III', title: 'Orchestration & GitOps',       desc: 'Running many things reliably; declaring what you want, letting a controller keep it true.' },
    { roman: 'IV',  title: 'Infrastructure & Cloud',       desc: 'Provisioning the ground you deploy onto — declaratively, from code.' },
    { roman: 'V',   title: 'Data, Applications & Security', desc: 'Databases, queues, caches, APIs, secrets, firewalls — and the patterns that hold them together.' },
    { roman: 'VI',  title: 'Observability',                desc: 'Metrics, logs, traces, dashboards, alerts — knowing what your systems are doing.' },
    { roman: 'VII', title: 'AI Interfaces',                desc: 'How LLM agents talk to your systems — the newest protocol layer.' },
  ];

  const TOPICS = [
    {
      id: 'cicd',
      part: 0,
      num: '01',
      title: 'Continuous Integration & Delivery',
      tag: 'The rhythm section of software delivery — merge often, ship on a beat, keep the trunk always releasable.',
      figure: {
        tag: 'Figure 1 · A five-stage pipeline',
        svg: `<svg class="figure-svg" viewBox="0 0 620 150" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <!-- Commit marker -->
          <g>
            <circle cx="30" cy="70" r="6" fill="currentColor" stroke="none"/>
            <text x="30" y="98" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">git push</text>
          </g>
          <!-- 5 stages -->
          <g>
            <rect x="60"  y="40" width="90" height="60"/>
            <text x="105" y="66" text-anchor="middle" font-size="11" font-weight="700" stroke="none">lint</text>
            <text x="105" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">~10s</text>

            <rect x="170" y="40" width="90" height="60"/>
            <text x="215" y="66" text-anchor="middle" font-size="11" font-weight="700" stroke="none">test</text>
            <text x="215" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">~2 min</text>

            <rect x="280" y="40" width="90" height="60"/>
            <text x="325" y="66" text-anchor="middle" font-size="11" font-weight="700" stroke="none">build</text>
            <text x="325" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">image push</text>

            <rect x="390" y="40" width="100" height="60"/>
            <text x="440" y="66" text-anchor="middle" font-size="11" font-weight="700" stroke="none">deploy·stg</text>
            <text x="440" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">auto</text>

            <rect x="510" y="40" width="90" height="60" class="fig-em" stroke="var(--accent)" stroke-width="1.5"/>
            <text x="555" y="66" text-anchor="middle" font-size="11" font-weight="700" stroke="none" class="fig-em">deploy·prod</text>
            <text x="555" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-em">manual gate</text>
          </g>
          <!-- Arrows between stages -->
          <g fill="currentColor">
            <path d="M 40 70 L 58 70" stroke="currentColor"/>
            <path d="M 152 70 L 168 70" stroke="currentColor"/>
            <polygon points="152,70 148,67 148,73"/>
            <path d="M 262 70 L 278 70" stroke="currentColor"/>
            <polygon points="262,70 258,67 258,73"/>
            <path d="M 372 70 L 388 70" stroke="currentColor"/>
            <polygon points="372,70 368,67 368,73"/>
            <path d="M 492 70 L 508 70" stroke="currentColor"/>
            <polygon points="492,70 488,67 488,73"/>
          </g>
          <!-- Fail-fast note -->
          <g stroke="none" fill="currentColor" class="fig-muted">
            <text x="105" y="130" text-anchor="middle" font-size="9">fast, likely to fail</text>
            <text x="325" y="130" text-anchor="middle" font-size="9">→ once green, single artifact promoted →</text>
            <text x="555" y="130" text-anchor="middle" font-size="9">expensive, requires trust</text>
          </g>
        </svg>`,
        caption: 'Every commit walks the same path — cheap checks first (lint runs in seconds), expensive ones later (build, deploy). Fail-fast: a red early stage stops the run before the slow stages start. One artifact from build promoted downstream — never rebuilt per environment.',
      },
      intro: `Continuous Integration is the discipline of merging every developer's work into a shared trunk many times a day, with automated build and tests running on each merge. Continuous Delivery keeps that trunk perpetually releasable; Continuous Deployment goes further and actually releases it, automatically, once the pipeline is green.
The whole point is <em>short feedback</em>: the sooner a broken change is discovered, the smaller and cheaper the fix. Long-lived branches and manual deploys are how ten-minute bugs turn into three-day investigations.
The mechanics — pipelines, stages, runners, artifacts, environments — are the same across GitLab CI, GitHub Actions, Jenkins, CircleCI, Buildkite, and the rest. Learn the shape once; each vendor just paints it differently.`,
      concepts: [
        ['Trunk-based development', 'The workflow CI was built for. Everyone commits (or short-lived-feature-branches then merges) to <code>main</code> at least once a day. Long-lived branches accumulate merge debt; trunk stays green because the pipeline enforces it.'],
        ['Pipeline', 'The scripted sequence a change moves through, split into <em>stages</em> (build, test, deploy) that run in order. Each stage has one or more <em>jobs</em> that run in parallel. The pipeline as a whole is triggered by a push, a merge request, a schedule, or manually.'],
        ['Job & Runner', 'A job is one unit of work — a shell script executed in a fresh container or VM. A runner (GitLab / GitHub name) or agent (Jenkins) is the machine that picks jobs off a queue and executes them. Shared runners are free but noisy; self-hosted runners run in your infra with your caches, your secrets, your speed.'],
        ['Artifact vs Cache', 'Both survive between jobs but for different reasons. <em>Artifacts</em> are versioned outputs meant to be promoted (compiled binary, container image, .whl, .jar). <em>Caches</em> are throwaway speed-ups (<code>node_modules</code>, Maven ~/.m2, pip wheels). Cache misses just slow you down; artifact misses break the build.'],
        ['Registry', 'Where artifacts live after a build. Container registries (GHCR, ECR, Harbor), package registries (npm, PyPI, Maven Central, Packagist), generic artifact stores (Nexus, Artifactory, S3). Every artifact gets a durable identity (tag + digest) so any environment can pull the exact bits.'],
        ['Immutable artifacts', 'Build once, promote everywhere. The same image tagged <code>api:1.4.2</code> that passed tests is the one that goes to staging and then production. Rebuilding per environment invites drift ("works in staging, fails in prod") — the whole point is that "works in staging" <em>proves</em> the artifact works.'],
        ['Fail fast', 'Order the pipeline so cheap, likely-to-fail checks run first (format, lint, unit tests) and expensive ones (integration, e2e, security scans, deploy) run after. A red early stage stops the run before you burn a slow test suite\'s runtime.'],
        ['Environments & Promotions', 'Not stages. An <em>environment</em> is a place software runs — <code>dev</code>, <code>staging</code>, <code>prod</code>. A <em>promotion</em> is moving the same artifact from one environment to the next. Track deployments per environment so you can always answer "what is running in prod right now?"'],
        ['CI secrets', 'Never in your YAML. Every CI system has a secrets store (GitLab CI/CD Variables, GitHub Secrets, Vault integrations) that injects values into the job environment. Mark them <em>masked</em> and <em>protected</em> (only exposed on protected branches).'],
        ['PR vs main pipelines', 'Different jobs run on merge requests vs on <code>main</code>. MR: fast checks, unit + integration tests, maybe a review app. main: everything, plus build the release artifact and (in CD) deploy. Use <code>rules:</code> / <code>if:</code> to branch by event.'],
        ['Delivery vs Deployment', 'Continuous <em>Delivery</em> keeps the trunk always releasable but leaves the promote-to-prod step as a human click. Continuous <em>Deployment</em> automates that click too. Same green-trunk discipline; the difference is trust and blast radius.'],
      ],
      code: `<span class="c"># .gitlab-ci.yml — build once, promote across environments</span>
<span class="k">stages</span>: [<span class="s">lint</span>, <span class="s">test</span>, <span class="s">build</span>, <span class="s">deploy-staging</span>, <span class="s">deploy-prod</span>]

<span class="k">variables</span>:
  <span class="k">IMAGE</span>: <span class="n">$CI_REGISTRY_IMAGE</span>:<span class="n">$CI_COMMIT_SHA</span>

<span class="k">lint</span>:
  <span class="k">stage</span>: <span class="s">lint</span>
  <span class="c"># fast, likely-to-fail — run first</span>
  <span class="k">script</span>: npm ci &amp;&amp; npm run lint
  <span class="k">cache</span>: { <span class="k">key</span>: node, <span class="k">paths</span>: [node_modules/] }

<span class="k">unit-test</span>:
  <span class="k">stage</span>: <span class="s">test</span>
  <span class="k">script</span>: npm ci &amp;&amp; npm test -- --coverage
  <span class="k">artifacts</span>: { <span class="k">paths</span>: [coverage/], <span class="k">expire_in</span>: <span class="s">1 week</span> }

<span class="k">build-image</span>:
  <span class="k">stage</span>: <span class="s">build</span>
  <span class="c"># the ONE artifact — everything below just promotes it</span>
  <span class="k">script</span>:
    - docker build -t <span class="n">$IMAGE</span> .
    - docker push <span class="n">$IMAGE</span>

<span class="k">deploy-staging</span>:
  <span class="k">stage</span>: <span class="s">deploy-staging</span>
  <span class="k">environment</span>: { <span class="k">name</span>: <span class="s">staging</span> }
  <span class="k">script</span>: kubectl -n staging set image deploy/api api=<span class="n">$IMAGE</span>
  <span class="k">rules</span>: [{ <span class="k">if</span>: <span class="s">'$CI_COMMIT_BRANCH == "main"'</span> }]

<span class="k">deploy-prod</span>:
  <span class="k">stage</span>: <span class="s">deploy-prod</span>
  <span class="c"># manual gate — flip to on_success for full CD</span>
  <span class="k">environment</span>: { <span class="k">name</span>: <span class="s">production</span> }
  <span class="k">script</span>: kubectl -n prod set image deploy/api api=<span class="n">$IMAGE</span>
  <span class="k">rules</span>: [{ <span class="k">if</span>: <span class="s">'$CI_COMMIT_BRANCH == "main"'</span>, <span class="k">when</span>: <span class="s">manual</span> }]`,
      codeCap: 'Fast checks first, one build, promoted to staging automatically and to prod on a manual click. Change <code>when: manual</code> to <code>when: on_success</code> to make it Continuous <em>Deployment</em>.',
      quiz: [
        {
          q: 'What is the primary purpose of Continuous Integration?',
          options: [
            'Deploy code to production automatically on every commit',
            'Merge every feature branch without review',
            'Detect integration problems early by frequently merging and testing',
            'Replace all manual QA testing',
          ],
          correct: 2,
          why: 'CI is about the shared trunk and fast feedback — the deployment part is CD.',
        },
        {
          q: 'What is a build artifact in a CI/CD pipeline?',
          options: [
            'A leftover temporary file from a failed build',
            'A versioned, packaged output — a binary, image, or archive — produced by a build step',
            'The source code before compilation',
            'A log file the runner produced',
          ],
          correct: 1,
          why: 'Artifacts are named, stored outputs so later stages pull by identity rather than rebuilding.',
        },
        {
          q: 'What does "fail fast" mean in the context of pipelines?',
          options: [
            'Run tests in a random order to catch flaky ones',
            'Order cheap checks first so a broken build stops before you waste time on expensive stages',
            'Deploy quickly to production so bugs surface',
            'Skip slow tests entirely',
          ],
          correct: 1,
          why: 'Lint and unit tests take seconds; failing them shouldn\'t wait behind a 10-minute integration suite.',
        },
        {
          q: 'What is the difference between Continuous Delivery and Continuous Deployment?',
          options: [
            'They are two names for the same thing',
            'Delivery ships to staging only; Deployment ships to production only',
            'Delivery keeps the trunk always releasable but a human clicks Promote; Deployment automates that click too',
            'Delivery uses Docker; Deployment uses VMs',
          ],
          correct: 2,
          why: 'Same green-trunk discipline; the difference is whether the final promote is manual or automated.',
        },
        {
          q: 'Where should build artifacts be stored?',
          options: [
            'Committed back to the git repository as binaries',
            'On the runner\'s local disk permanently',
            'In a dedicated registry — container registry, package registry, artifact storage — with versioned identities',
            'Emailed to the release manager',
          ],
          correct: 2,
          why: 'Registries give artifacts a durable, immutable identity that any environment can pull.',
        },
      ],
    },

    {
      id: 'docker',
      part: 0,
      num: '02',
      title: 'Docker & Containers',
      tag: 'A process with its own view of the filesystem, network, and processes — packaged with what it needs, sharing the host kernel.',
      figure: {
        tag: 'Figure 1 · The container abstraction',
        svg: `<svg class="figure-svg" viewBox="0 0 560 220" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <!-- three containers on top -->
          <g>
            <rect x="40" y="30" width="140" height="120"/>
            <text x="110" y="52" text-anchor="middle" font-size="12" font-weight="700" stroke="none">container A</text>
            <text x="110" y="72" text-anchor="middle" font-size="10" class="fig-muted" stroke="none">image: node:20</text>
            <text x="110" y="90" text-anchor="middle" font-size="10" class="fig-muted" stroke="none">PID 1 = api</text>
            <line x1="60" y1="102" x2="160" y2="102" stroke-dasharray="2 3" opacity="0.4"/>
            <text x="110" y="120" text-anchor="middle" font-size="9" class="fig-muted" stroke="none">own PID / mnt / net ns</text>
            <text x="110" y="136" text-anchor="middle" font-size="9" class="fig-muted" stroke="none">cpu + memory cgroup</text>

            <rect x="210" y="30" width="140" height="120"/>
            <text x="280" y="52" text-anchor="middle" font-size="12" font-weight="700" stroke="none">container B</text>
            <text x="280" y="72" text-anchor="middle" font-size="10" class="fig-muted" stroke="none">image: nginx:1.27</text>
            <text x="280" y="90" text-anchor="middle" font-size="10" class="fig-muted" stroke="none">PID 1 = nginx</text>
            <line x1="230" y1="102" x2="330" y2="102" stroke-dasharray="2 3" opacity="0.4"/>
            <text x="280" y="120" text-anchor="middle" font-size="9" class="fig-muted" stroke="none">own PID / mnt / net ns</text>
            <text x="280" y="136" text-anchor="middle" font-size="9" class="fig-muted" stroke="none">cpu + memory cgroup</text>

            <rect x="380" y="30" width="140" height="120"/>
            <text x="450" y="52" text-anchor="middle" font-size="12" font-weight="700" stroke="none">container C</text>
            <text x="450" y="72" text-anchor="middle" font-size="10" class="fig-muted" stroke="none">image: postgres:16</text>
            <text x="450" y="90" text-anchor="middle" font-size="10" class="fig-muted" stroke="none">PID 1 = postgres</text>
            <line x1="400" y1="102" x2="500" y2="102" stroke-dasharray="2 3" opacity="0.4"/>
            <text x="450" y="120" text-anchor="middle" font-size="9" class="fig-muted" stroke="none">own PID / mnt / net ns</text>
            <text x="450" y="136" text-anchor="middle" font-size="9" class="fig-muted" stroke="none">cpu + memory cgroup</text>
          </g>
          <!-- connections down to kernel -->
          <g stroke-dasharray="1 3" opacity="0.35">
            <line x1="110" y1="150" x2="110" y2="170"/>
            <line x1="280" y1="150" x2="280" y2="170"/>
            <line x1="450" y1="150" x2="450" y2="170"/>
          </g>
          <!-- shared kernel bar -->
          <rect x="40" y="170" width="480" height="30"/>
          <text x="280" y="190" text-anchor="middle" font-size="11" font-weight="700" stroke="none">host Linux kernel — shared</text>
        </svg>`,
        caption: 'Every container is a process (or process tree) running against the SAME host kernel, each isolated by its own namespaces and constrained by its own cgroups. No guest OS — that\'s why containers start in milliseconds and a laptop can hold dozens.',
      },
      intro: `A container is a process (or process tree) running with its own view of the filesystem, network, and process tree. It shares the <em>host OS kernel</em> — no guest OS — which is why it's cheaper and faster than a VM, and everything the process needs is bundled inside its image, which is why it's more predictable than "run it on the server."
The primitives depend on the host. On <em>Linux</em> hosts (99% of production), containers are Linux processes isolated with kernel <em>namespaces</em> and constrained with <em>cgroups</em>. Windows Server has its own native container implementation using job objects and Server silos. Two hard rules: <strong>the image dictates the OS userspace</strong> (an Alpine image ships a Linux userspace; a <code>windows/servercore</code> image ships Windows binaries), and <strong>the image OS must match the host kernel</strong>. On a Mac or Windows laptop running Docker Desktop, "Linux containers" actually run inside a small hidden Linux VM (LinuxKit / WSL2) — the illusion is native but there is a VM in the middle.
Docker made this ergonomic. It gave us a build language (the <code>Dockerfile</code>), an artifact format (the image), a runtime (the daemon + CLI), and a distribution format (registries). Today the wider ecosystem uses lower-level runtimes (<code>containerd</code>, <code>runc</code>) under the hood, but the Docker CLI and Dockerfile format are the durable interface almost every engineer speaks.`,
      concepts: [
        ['Namespaces & cgroups (runtime, not build)', "The Linux kernel primitives that make a container a container — and a common trap: they're <strong>set up at runtime</strong> (by <code>runc</code> / <code>containerd</code> when the container is <em>started</em>), <strong>not at build time</strong>. Nothing in your Dockerfile creates them. <em>Namespaces</em> isolate what a process can see: pid (own process tree), mount (own filesystem view), network (own interfaces + routes), uts (own hostname), ipc (own shared memory), user (own UID/GID mapping), cgroup (own view of cgroups). <em>Cgroups</em> constrain what it can consume: CPU shares/quota, memory ceiling, block I/O, PID count. A container is a process (or process tree) launched inside a set of both. The knobs live in <code>docker run</code> flags (<code>--memory</code>, <code>--cpus</code>, <code>--network</code>, <code>--pid</code>), <code>docker-compose.yml</code>, or a Kubernetes Pod's <code>resources</code> + <code>securityContext</code> — not in <code>FROM</code>, <code>RUN</code>, or <code>COPY</code>."],
        ['Image', 'A read-only template: a stack of filesystem layers plus metadata (entrypoint, cmd, env, exposed ports, user, working dir). Immutable and content-addressed by digest (<code>sha256:...</code>). A tag (<code>api:1.4.2</code>) is a movable pointer; the digest is the truth.'],
        ['Container', 'A running instance of an image — the image plus a writable top layer plus a running process (or exited process, if it has stopped). One image → many containers, all independent, each with their own writable layer.'],
        ['Dockerfile', 'The recipe for an image. Each instruction (<code>FROM</code>, <code>RUN</code>, <code>COPY</code>, <code>ENV</code>, <code>USER</code>, <code>CMD</code>, <code>ENTRYPOINT</code>) produces a layer. Order matters intensely: everything below a changed layer is rebuilt.'],
        ['Layer caching', 'Docker keeps a hash of each layer\'s inputs. Put steps in <em>stability order</em>: install OS packages first, then copy just the dep manifest and install deps, then copy the source. That way a source change invalidates only the last two layers, not the whole build.'],
        ['Multi-stage builds', 'A Dockerfile with several <code>FROM</code> stages. Build with a fat image full of compilers; <code>COPY --from=build</code> just the artifact into a tiny runtime image. Final image ships with none of the build tooling. Massive size and attack-surface wins.'],
        ['`.dockerignore`', 'Like <code>.gitignore</code> but for the build context that gets sent to the daemon. Keep <code>node_modules</code>, <code>.git</code>, <code>*.env</code>, huge test fixtures, and build outputs out — makes builds faster and prevents accidentally shipping secrets.'],
        ['Volumes vs bind mounts', 'Persistent state. A <em>volume</em> is Docker-managed storage that outlives the container (<code>docker volume create db-data</code>). A <em>bind mount</em> maps a host path directly into the container (<code>-v $(pwd):/app</code>) — used in dev to hot-reload code, rarely in prod.'],
        ['Networking (bridge / host / overlay)', 'Default is <em>bridge</em>: containers get a private network, ports are published to the host with <code>-p 8080:80</code>. <em>host</em>: container shares host\'s network stack (no isolation, no port mapping). <em>overlay</em>: multi-host networking used by Swarm / Kubernetes.'],
        ['Docker Compose', 'A YAML file describing multiple containers as one application — service definitions, networks, volumes, environment. <code>docker compose up</code> starts the whole stack. Dev-workflow staple, occasionally used in small production too.'],
        ['Registries & digests', 'Where images live and how they\'re distributed: Docker Hub, GHCR, ECR, GCR, Harbor. <code>docker push acme/api:1.4.2</code>; anywhere in the world, <code>docker pull acme/api@sha256:...</code> gets the exact same bytes.'],
        ['Rootless & security', 'Modern deployments run containers as non-root: a <code>USER app</code> line in the Dockerfile, or <code>--user 1000:1000</code> at run. Drop Linux capabilities (<code>--cap-drop=ALL --cap-add=NET_BIND_SERVICE</code>). Scan images with Trivy or Grype before pushing.'],
      ],
      code: `<span class="c"># Dockerfile — multi-stage node build, non-root, digest-pinned base</span>
<span class="k">FROM</span> node:20.11-alpine@sha256:abc123... <span class="k">AS</span> build
<span class="k">WORKDIR</span> /app
<span class="k">COPY</span> package*.json ./
<span class="k">RUN</span> npm ci                                <span class="c"># cached unless package*.json changes</span>
<span class="k">COPY</span> . .
<span class="k">RUN</span> npm run build

<span class="k">FROM</span> nginx:1.27-alpine
<span class="k">COPY</span> --from=build /app/dist /usr/share/nginx/html
<span class="k">USER</span> nginx                                  <span class="c"># never run as root in prod</span>
<span class="k">EXPOSE</span> 8080
<span class="k">HEALTHCHECK</span> --interval=30s CMD wget -qO- http://localhost:8080/healthz || exit 1

<span class="c"># docker-compose.yml — app + Postgres for local dev</span>
<span class="k">services</span>:
  <span class="k">api</span>:
    <span class="k">build</span>: .
    <span class="k">ports</span>: [<span class="s">"3000:3000"</span>]
    <span class="k">environment</span>:
      <span class="k">DATABASE_URL</span>: <span class="s">postgres://app:app@db/app</span>
    <span class="k">depends_on</span>: [db]
    <span class="k">volumes</span>: [<span class="s">".:/app"</span>, <span class="s">"/app/node_modules"</span>]   <span class="c"># bind mount for hot reload</span>
  <span class="k">db</span>:
    <span class="k">image</span>: postgres:16
    <span class="k">environment</span>:
      <span class="k">POSTGRES_USER</span>: app
      <span class="k">POSTGRES_PASSWORD</span>: app
      <span class="k">POSTGRES_DB</span>: app
    <span class="k">volumes</span>: [<span class="s">"db-data:/var/lib/postgresql/data"</span>]   <span class="c"># named volume, persists</span>
<span class="k">volumes</span>: { <span class="k">db-data</span>: {} }

<span class="c"># Day-to-day CLI</span>
$ docker build -t api:dev .
$ docker run --rm -it -p 3000:3000 api:dev
$ docker compose up -d
$ docker exec -it api sh                       <span class="c"># attach a shell to a running container</span>
$ docker logs -f --tail=100 api                <span class="c"># tail logs</span>
$ docker image prune -a                        <span class="c"># reclaim disk from old images</span>`,
      codeCap: 'Multi-stage build for a slim image, non-root user, healthcheck, compose for local dev, and the six CLI verbs you\'ll actually use daily.',
      quiz: [
        {
          q: 'What is a Docker image made of?',
          options: [
            'A single compressed archive',
            'A stack of read-only filesystem layers plus metadata',
            'A virtual machine disk image',
            'A collection of running processes',
          ],
          correct: 1,
          why: 'Layers are how Docker caches, deduplicates, and ships images efficiently.',
        },
        {
          q: 'What is the difference between an image and a container?',
          options: [
            'They are synonyms',
            'An image is the template; a container is a running instance of that template with a writable top layer',
            'An image is bigger than a container',
            'An image is what runs; a container is what\'s stored',
          ],
          correct: 1,
          why: 'One image, many containers — like a class and its instances.',
        },
        {
          q: 'Why does the order of instructions in a Dockerfile matter for build speed?',
          options: [
            'It doesn\'t; all instructions run in parallel',
            'Instructions above a changed line invalidate everything below',
            'A changed layer invalidates every layer below it, so put stable steps (deps) before volatile ones (source)',
            'Only the first instruction is cached',
          ],
          correct: 2,
          why: 'Copying package.json and running npm ci before copying the source is the classic order.',
        },
        {
          q: 'What does <code>docker exec -it &lt;container&gt; sh</code> do?',
          options: [
            'Restarts the container with a shell as PID 1',
            'Attaches an interactive shell inside an already-running container',
            'Rebuilds the container image',
            'Executes a shell script on the host machine',
          ],
          correct: 1,
          why: 'exec runs a new process inside an existing container — invaluable for debugging.',
        },
        {
          q: 'What does <code>.dockerignore</code> do?',
          options: [
            'Lists files to hide from the container at runtime',
            'Prevents matching files from being sent to the Docker daemon as build context',
            'Lists errors the build should ignore',
            'Marks files as secret',
          ],
          correct: 1,
          why: 'Everything in the build context gets shipped to the daemon; ignoring node_modules and .git saves seconds and prevents accidental leaks.',
        },
      ],
    },

    {
      id: 'k8s',
      part: 2,
      num: '10',
      title: 'Kubernetes',
      tag: 'A control loop keeping declared state and reality in agreement — pods, labels, probes, and thirteen objects you\'ll actually use.',
      figure: {
        tag: 'Figure 1 · How a Deployment stays alive',
        svg: `<svg class="figure-svg" viewBox="0 0 560 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <!-- Deployment (top layer) -->
          <g>
            <rect x="180" y="20" width="200" height="52"/>
            <text x="280" y="42" text-anchor="middle" font-size="12" font-weight="700" stroke="none">Deployment</text>
            <text x="280" y="60" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">replicas: 3 · rolling update</text>
          </g>
          <!-- arrow down to ReplicaSet -->
          <g stroke="currentColor" fill="currentColor">
            <line x1="280" y1="72" x2="280" y2="98"/>
            <polygon points="280,98 276,92 284,92"/>
            <text x="290" y="90" font-size="9" stroke="none" class="fig-muted">owns</text>
          </g>
          <!-- ReplicaSet -->
          <g>
            <rect x="180" y="100" width="200" height="52"/>
            <text x="280" y="122" text-anchor="middle" font-size="12" font-weight="700" stroke="none">ReplicaSet</text>
            <text x="280" y="140" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">selector: app=api · watches count</text>
          </g>
          <!-- three arrows down to pods -->
          <g stroke="currentColor" fill="currentColor">
            <line x1="220" y1="152" x2="120" y2="188"/>
            <polygon points="120,188 122,180 128,184"/>
            <line x1="280" y1="152" x2="280" y2="188"/>
            <polygon points="280,188 276,182 284,182"/>
            <line x1="340" y1="152" x2="440" y2="188"/>
            <polygon points="440,188 434,184 432,180"/>
          </g>
          <!-- three pods -->
          <g>
            <rect x="60" y="190" width="120" height="52"/>
            <text x="120" y="212" text-anchor="middle" font-size="11" font-weight="700" stroke="none">Pod api-6b7…</text>
            <text x="120" y="228" text-anchor="middle" font-size="9" stroke="none" class="fig-em">app=api ✓</text>

            <rect x="220" y="190" width="120" height="52"/>
            <text x="280" y="212" text-anchor="middle" font-size="11" font-weight="700" stroke="none">Pod api-2c3…</text>
            <text x="280" y="228" text-anchor="middle" font-size="9" stroke="none" class="fig-em">app=api ✓</text>

            <rect x="380" y="190" width="120" height="52"/>
            <text x="440" y="212" text-anchor="middle" font-size="11" font-weight="700" stroke="none">Pod api-9f8…</text>
            <text x="440" y="228" text-anchor="middle" font-size="9" stroke="none" class="fig-em">app=api ✓</text>
          </g>
          <!-- Service selector arrow -->
          <g stroke="var(--accent)" fill="var(--accent)" stroke-width="1.2">
            <path d="M 530 216 Q 520 216 505 216" stroke-dasharray="3 3"/>
            <text x="540" y="220" font-size="10" stroke="none" class="fig-em" font-weight="700">Service</text>
            <text x="540" y="234" font-size="9" stroke="none" class="fig-em">selector:</text>
            <text x="540" y="246" font-size="9" stroke="none" class="fig-em">app=api</text>
          </g>
        </svg>`,
        caption: 'Deployment → ReplicaSet → Pods. The Deployment owns a ReplicaSet, which keeps the declared number of Pods alive; if one dies, another spawns. Services find those Pods purely by matching label selectors — no name-binding, so the fleet can churn without breaking routing.',
      },
      intro: `Kubernetes is a container orchestrator built on one idea: you <em>declare</em> what you want (three replicas of this image, exposed on port 80, with these resource limits, matching these labels) and a control loop keeps reality in agreement — forever. You never tell it <em>how</em> to schedule pods, replace failed ones, or route traffic; you tell it the target, and it converges.
Every object lives in <code>etcd</code>, the cluster's distributed key-value store, behind the <code>kube-apiserver</code>. Controllers (Deployment, ReplicaSet, StatefulSet, ...) watch the API and take action to close the gap between spec and status. <code>kubectl</code> is just a friendly HTTP client that reads and writes those objects.
Most day-to-day Kubernetes is picking the right handful of objects, wiring them together with labels, and understanding what fails when. The list below is that handful.`,
      concepts: [
        ['Control plane vs worker nodes', 'The <em>control plane</em> (api-server, etcd, scheduler, controllers, cloud-controller-manager) runs the cluster. <em>Worker nodes</em> run the actual workload pods and each has a kubelet (talks to the control plane) and a container runtime (containerd, CRI-O). Managed K8s (EKS, GKE, AKS) hides the control plane; you only see workers.'],
        ['Declarative model & control loop', 'Every object has a <em>spec</em> (what you want) and <em>status</em> (what is). Controllers watch objects, compare spec to status, and act to close the gap. This runs continuously, not once — kill a pod, the ReplicaSet notices and creates a new one within seconds.'],
        ['Pod', 'The smallest deployable unit. Almost always one main container; sometimes a couple of tightly-coupled ones (app + sidecar for logging, envoy, or vault-agent). Containers in a Pod share the network namespace (<code>localhost</code>) and can share volumes. Init containers run to completion before the app containers start.'],
        ['Labels & selectors', 'The glue that ties everything together. Objects are labelled (<code>app: api</code>, <code>env: prod</code>) and other objects select them by label. Services find Pods this way; Deployments own Pods this way; NetworkPolicies allow/deny this way. Get labels wrong and objects silently orphan.'],
        ['Deployment & ReplicaSet', "A <code>Deployment</code> manages a <code>ReplicaSet</code>, which manages Pods. Deployment gives you rolling updates, rollback (<code>kubectl rollout undo</code>), revision history, and configurable update strategy (<em>RollingUpdate</em> with <code>maxSurge</code>/<code>maxUnavailable</code>, or <em>Recreate</em>). You almost never touch ReplicaSets directly."],
        ['Service (types)', "Stable virtual IP and DNS in front of Pods matched by a label selector. <em>ClusterIP</em> (default): reachable only inside the cluster. <em>NodePort</em>: exposes on a port of every node. <em>LoadBalancer</em>: asks the cloud for a real LB. <em>headless</em> (<code>clusterIP: None</code>): DNS returns Pod IPs directly, used by StatefulSets."],
        ['Ingress + Ingress Controller', 'HTTP(S) routing on top of Services — host- and path-based rules, TLS termination. An <code>Ingress</code> is just <em>configuration</em>; you need an Ingress <em>Controller</em> (nginx-ingress, Traefik, HAProxy, cloud-native) actually running in the cluster to do the work. The Gateway API is the modern successor.'],
        ['ConfigMap & Secret', 'Configuration data mounted into Pods as env vars or files. <code>ConfigMap</code> for non-sensitive; <code>Secret</code> for sensitive (base64-encoded, not encrypted at rest by default — enable envelope encryption in etcd, or source from an external secret store via [[secrets]]).'],
        ['Volumes & PersistentVolumeClaims', 'Storage. <code>emptyDir</code> lives with the Pod. <code>PersistentVolume</code> is cluster-wide durable storage; a <code>PersistentVolumeClaim</code> is a request from a Pod for a certain size and class. <em>StorageClass</em> defines how PVs are provisioned (dynamic provisioning is the norm).'],
        ['Namespace & ResourceQuota', 'Soft partition of a cluster. Names are unique within a namespace; you scope RBAC and quotas per namespace. Common patterns: one namespace per team, one per environment, or one per app. <code>ResourceQuota</code> caps how much CPU/memory/pods a namespace can consume.'],
        ['Requests & Limits, QoS', "Each container declares CPU/memory <em>requests</em> (what the scheduler reserves) and <em>limits</em> (hard ceiling). Requests only → <em>Burstable</em>. Requests==Limits → <em>Guaranteed</em>. Neither → <em>BestEffort</em> (first to be killed under pressure)."],
        ['Probes (liveness / readiness / startup)', "How the kubelet decides pod health. <em>Liveness</em>: restart if it fails. <em>Readiness</em>: remove from Service endpoints until it passes (used during startup and temporary distress). <em>Startup</em>: give slow-starting apps a grace period before liveness starts checking."],
        ['HorizontalPodAutoscaler (HPA)', 'Scales a Deployment based on CPU, memory, or custom metrics. <code>kubectl autoscale deploy/api --min=3 --max=20 --cpu-percent=70</code>. Combined with the Cluster Autoscaler on nodes, you get end-to-end autoscaling.'],
      ],
      code: `<span class="c"># Deployment + Service + ConfigMap — the working shape</span>
<span class="k">apiVersion</span>: v1
<span class="k">kind</span>: ConfigMap
<span class="k">metadata</span>: { <span class="k">name</span>: <span class="s">api-config</span>, <span class="k">namespace</span>: <span class="s">prod</span> }
<span class="k">data</span>:
  LOG_LEVEL: <span class="s">"info"</span>
  FEATURE_X: <span class="s">"true"</span>
---
<span class="k">apiVersion</span>: apps/v1
<span class="k">kind</span>: Deployment
<span class="k">metadata</span>: { <span class="k">name</span>: <span class="s">api</span>, <span class="k">namespace</span>: <span class="s">prod</span>, <span class="k">labels</span>: { <span class="k">app</span>: <span class="s">api</span> } }
<span class="k">spec</span>:
  <span class="k">replicas</span>: <span class="n">3</span>
  <span class="k">strategy</span>:
    <span class="k">type</span>: <span class="s">RollingUpdate</span>
    <span class="k">rollingUpdate</span>: { <span class="k">maxSurge</span>: <span class="n">1</span>, <span class="k">maxUnavailable</span>: <span class="n">0</span> }
  <span class="k">selector</span>: { <span class="k">matchLabels</span>: { <span class="k">app</span>: <span class="s">api</span> } }
  <span class="k">template</span>:
    <span class="k">metadata</span>: { <span class="k">labels</span>: { <span class="k">app</span>: <span class="s">api</span> } }
    <span class="k">spec</span>:
      <span class="k">containers</span>:
        - <span class="k">name</span>: <span class="s">api</span>
          <span class="k">image</span>: <span class="s">ghcr.io/acme/api:1.4.2</span>
          <span class="k">ports</span>: [{ <span class="k">containerPort</span>: <span class="n">8080</span> }]
          <span class="k">envFrom</span>: [{ <span class="k">configMapRef</span>: { <span class="k">name</span>: <span class="s">api-config</span> } }]
          <span class="k">resources</span>:
            <span class="k">requests</span>: { <span class="k">cpu</span>: <span class="s">100m</span>, <span class="k">memory</span>: <span class="s">128Mi</span> }
            <span class="k">limits</span>:   { <span class="k">cpu</span>: <span class="s">500m</span>, <span class="k">memory</span>: <span class="s">256Mi</span> }
          <span class="k">readinessProbe</span>:
            <span class="k">httpGet</span>: { <span class="k">path</span>: <span class="s">/healthz</span>, <span class="k">port</span>: <span class="n">8080</span> }
            <span class="k">initialDelaySeconds</span>: <span class="n">5</span>
            <span class="k">periodSeconds</span>: <span class="n">3</span>
          <span class="k">livenessProbe</span>:
            <span class="k">httpGet</span>: { <span class="k">path</span>: <span class="s">/healthz</span>, <span class="k">port</span>: <span class="n">8080</span> }
            <span class="k">initialDelaySeconds</span>: <span class="n">30</span>
            <span class="k">periodSeconds</span>: <span class="n">10</span>
---
<span class="k">apiVersion</span>: v1
<span class="k">kind</span>: Service
<span class="k">metadata</span>: { <span class="k">name</span>: <span class="s">api</span>, <span class="k">namespace</span>: <span class="s">prod</span> }
<span class="k">spec</span>:
  <span class="k">selector</span>: { <span class="k">app</span>: <span class="s">api</span> }
  <span class="k">ports</span>: [{ <span class="k">port</span>: <span class="n">80</span>, <span class="k">targetPort</span>: <span class="n">8080</span> }]

<span class="c"># Day-to-day kubectl</span>
$ kubectl get pods -n prod -l app=api
$ kubectl describe pod api-6b7... -n prod            <span class="c"># events at the bottom often explain everything</span>
$ kubectl logs -f deploy/api -n prod --tail=100
$ kubectl rollout status deploy/api -n prod
$ kubectl rollout undo deploy/api -n prod            <span class="c"># bad deploy, roll back</span>
$ kubectl exec -it deploy/api -n prod -- sh
$ kubectl port-forward svc/api 8080:80 -n prod        <span class="c"># local access, no ingress needed</span>`,
      codeCap: 'Labels connect Deployment → Pods and Service → Pods. Probes gate traffic. Requests/limits shape scheduling. Everything ties together through the label selectors.',
      quiz: [
        {
          q: 'What is a Pod in Kubernetes?',
          options: [
            'A physical server in the cluster',
            'The smallest deployable unit — one or more tightly-coupled containers sharing network and storage',
            'A collection of nodes',
            'A namespace',
          ],
          correct: 1,
          why: 'Containers inside a Pod share an IP and can talk over localhost. Usually you have one container per Pod.',
        },
        {
          q: 'Why use a Deployment instead of creating Pods directly?',
          options: [
            'Deployments cost less',
            'A Deployment manages a ReplicaSet that keeps the desired number of Pods alive and provides rolling updates and rollbacks',
            'Pods can\'t have containers',
            'Deployments are the only way to reach the internet',
          ],
          correct: 1,
          why: 'A bare Pod dies and is gone. A Deployment replaces it.',
        },
        {
          q: 'What is the role of a Service?',
          options: [
            'It runs a single container',
            'It provides a stable network endpoint that load-balances to whichever Pods currently match its label selector',
            'It stores persistent data',
            'It schedules Pods to Nodes',
          ],
          correct: 1,
          why: 'Pods are ephemeral; a Service is a stable name in front of them.',
        },
        {
          q: 'What is a ConfigMap for?',
          options: [
            'Storing passwords and API keys',
            'Storing non-sensitive configuration that Pods can mount as env vars or files',
            'Mapping cluster network configuration',
            'Defining pod resource limits',
          ],
          correct: 1,
          why: 'Sensitive values belong in Secrets — ideally sourced from a real secret store.',
        },
        {
          q: 'How does <code>kubectl apply</code> differ from <code>kubectl create</code>?',
          options: [
            '<code>apply</code> is deprecated',
            '<code>apply</code> is declarative — it merges changes into whatever\'s there; <code>create</code> is imperative and fails if the object already exists',
            '<code>create</code> supports YAML; <code>apply</code> does not',
            'They\'re identical commands',
          ],
          correct: 1,
          why: 'Prefer apply for anything you\'ll edit repeatedly — it plays nicely with GitOps.',
        },
      ],
    },

    {
      id: 'helm',
      part: 2,
      num: '11',
      title: 'Helm',
      tag: 'The package manager for Kubernetes — templated manifests, values files, releases, rollbacks, dependencies.',
      figure: {
        tag: 'Figure 1 · From chart to release',
        svg: `<svg class="figure-svg" viewBox="0 0 620 240" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="40" width="140" height="120"/>
            <text x="90" y="58" text-anchor="middle" font-size="11" font-weight="700" stroke="none">chart/</text>
            <text x="30" y="80" font-size="9" stroke="none" class="fig-muted">Chart.yaml</text>
            <text x="30" y="94" font-size="9" stroke="none" class="fig-muted">values.yaml   (defaults)</text>
            <text x="30" y="108" font-size="9" stroke="none" class="fig-muted">templates/</text>
            <text x="42" y="122" font-size="9" stroke="none" class="fig-muted">deployment.yaml.tpl</text>
            <text x="42" y="136" font-size="9" stroke="none" class="fig-muted">service.yaml.tpl</text>
            <text x="42" y="150" font-size="9" stroke="none" class="fig-muted">_helpers.tpl</text>
          </g>
          <path d="M 160 100 L 198 100" stroke="currentColor"/><polygon points="198,100 193,97 193,103" fill="currentColor"/>
          <g>
            <rect x="200" y="40" width="180" height="120"/>
            <text x="290" y="58" text-anchor="middle" font-size="11" font-weight="700" stroke="none">values-prod.yaml</text>
            <text x="290" y="76" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">+ --set overrides</text>
            <line x1="210" y1="90" x2="370" y2="90" stroke-dasharray="2 3" opacity="0.4"/>
            <text x="290" y="112" text-anchor="middle" font-size="11" font-weight="700" stroke="none">helm upgrade --install</text>
            <text x="290" y="130" text-anchor="middle" font-size="9" stroke="none" class="fig-em">--atomic --wait --timeout 5m</text>
            <text x="290" y="148" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">Go templates → manifests</text>
          </g>
          <path d="M 380 100 L 418 100" stroke="currentColor"/><polygon points="418,100 413,97 413,103" fill="currentColor"/>
          <g>
            <rect x="420" y="40" width="180" height="120" stroke="var(--accent)"/>
            <text x="510" y="60" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">Release: api</text>
            <text x="510" y="78" text-anchor="middle" font-size="9" stroke="none" class="fig-em">rev. 7 · deployed 12:03</text>
            <text x="510" y="102" text-anchor="middle" font-size="10" stroke="none">Deployment/api</text>
            <text x="510" y="118" text-anchor="middle" font-size="10" stroke="none">Service/api</text>
            <text x="510" y="134" text-anchor="middle" font-size="10" stroke="none">Secret/api-config</text>
            <text x="510" y="152" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">helm rollback api 6 · undo</text>
          </g>
          <text x="20" y="204" font-size="9" font-weight="700" letter-spacing="0.2em" stroke="none" class="fig-muted">CHART  ·  VALUES + COMMAND  ·  NAMED RELEASE WITH REVISION</text>
        </svg>`,
        caption: 'A chart is a template plus defaults. A release is that template rendered with your values and applied under a name, with a revision number stored in the cluster. Rollback is one command because Helm keeps every rendered revision alongside the current one.',
      },
      intro: `Kubernetes manifests are verbose and repetitive across environments — the same Deployment in dev, staging, and prod differs only in a handful of values (replicas, image tag, resources, ingress host). Helm bundles the manifests into a <em>chart</em>: a directory of Go-templated YAML plus a defaults file, packageable as a tarball. Users install a chart with their own <em>values</em>, and the whole bundle is managed as a single unit called a <em>release</em>.
It is the closest thing the Kubernetes ecosystem has to a shared packaging format. Most third-party software you deploy on K8s (Prometheus, Ingress-nginx, cert-manager, Redis, Postgres operators) ships as a Helm chart.`,
      concepts: [
        ['Chart', "The package. A directory with <code>Chart.yaml</code> (name, version, appVersion, dependencies), <code>values.yaml</code> (defaults), and <code>templates/</code> (Go-templated manifests). Also <code>charts/</code> for bundled dependencies and <code>crds/</code> for CustomResourceDefinitions that must apply before templates."],
        ['Chart.yaml', "The chart’s identity: name, <code>version</code> (chart schema version), <code>appVersion</code> (the app the chart deploys), <code>type</code> (application vs library), <code>dependencies</code> (sub-charts pulled in from repos). <code>helm package</code> uses <code>version</code> for the tarball name."],
        ['values.yaml', "The chart’s default configuration. A tree of arbitrary YAML. Users override individual values with <code>--set image.tag=1.5</code> or their own <code>-f prod-values.yaml</code>. Layered: chart defaults → sub-chart values → user file → --set (highest priority)."],
        ['Templating (Go + Sprig)', "Go’s <code>text/template</code> plus the Sprig function library. <code>{{ .Values.image.tag }}</code>, <code>{{ .Release.Name }}</code>, <code>{{ include \"api.fullname\" . }}</code>. Helpers live in <code>templates/_helpers.tpl</code> (files starting with <code>_</code> aren’t rendered as manifests). Flow control: <code>{{ if }}</code>, <code>{{ range }}</code>, <code>{{ with }}</code>."],
        ['Release', "A specific installation of a chart into a cluster, identified by a name (<code>helm install api ./chart</code>) and a namespace. Every install/upgrade bumps its <em>revision</em>. <code>helm list -A</code> shows them. Releases store their state as Secrets in the target namespace (used to be ConfigMaps in Helm 2 with Tiller — which is dead now)."],
        ['upgrade --install pattern', "<code>helm upgrade --install api ./chart -f prod-values.yaml</code>: installs if absent, upgrades if present. Idempotent, safe from CI, the one incantation you actually use. Add <code>--atomic</code> to auto-rollback on failure, <code>--wait</code> to block until Ready, <code>--timeout 5m</code> to bound it."],
        ['Rollback', "<code>helm rollback api 3</code> returns the release to revision 3. Every previous rendered manifest is stored, so undo is one command. <code>helm history api</code> shows revisions. In CI, <code>--atomic</code> automates rollback-on-failure so you rarely rollback by hand."],
        ['helm template & --dry-run', "Preview what would apply. <code>helm template api ./chart -f values.yaml</code> renders manifests to stdout without touching the cluster — great for kubectl diff or committing to git for [[argocd]]. <code>--dry-run</code> talks to the API server for server-side validation."],
        ['Dependencies & umbrella charts', "<code>dependencies:</code> in <code>Chart.yaml</code> lists sub-charts. <code>helm dependency update</code> fetches them into <code>charts/</code>. An <em>umbrella chart</em> is a chart whose only content is dependencies — shipping “an application” that’s actually five services deployed together."],
        ['Chart repositories', "Where charts live. <code>helm repo add prometheus-community https://...</code>, <code>helm search repo prometheus</code>, <code>helm install prom prometheus-community/kube-prometheus-stack</code>. Modern repos are OCI-based (charts pushed to a container registry as OCI artifacts) — Docker Hub, GHCR, ECR all support this."],
        ['Hooks', "Annotations that make a manifest run at a specific point in the release lifecycle: <code>pre-install</code>, <code>post-install</code>, <code>pre-upgrade</code>, <code>test</code>. Used for schema migrations, seed data, sanity checks. <code>helm test</code> runs the test hooks."],
        ['Helm vs Kustomize', "Different philosophies. Helm: templating + package. Kustomize: overlays and patches on plain YAML. Helm wins for redistributing to strangers; Kustomize wins for your own internal repos where you don’t need a chart interface. Modern K8s uses both, often together (Helm to render, Kustomize to overlay)."],
      ],
      code: `<span class="c"># Chart layout</span>
<span class="c"># chart/</span>
<span class="c"># ├── Chart.yaml            # name, version, appVersion, dependencies</span>
<span class="c"># ├── values.yaml           # defaults</span>
<span class="c"># ├── templates/</span>
<span class="c"># │   ├── _helpers.tpl      # named templates (helpers)</span>
<span class="c"># │   ├── deployment.yaml</span>
<span class="c"># │   ├── service.yaml</span>
<span class="c"># │   ├── ingress.yaml</span>
<span class="c"># │   └── NOTES.txt         # printed after install</span>
<span class="c"># └── charts/               # bundled sub-charts</span>

<span class="c"># values.yaml — the knobs</span>
<span class="k">image</span>:
  <span class="k">repository</span>: ghcr.io/acme/api
  <span class="k">tag</span>: <span class="s">"1.4.2"</span>
<span class="k">replicaCount</span>: <span class="n">3</span>
<span class="k">resources</span>:
  <span class="k">requests</span>: { <span class="k">cpu</span>: <span class="s">100m</span>, <span class="k">memory</span>: <span class="s">128Mi</span> }
<span class="k">ingress</span>:
  <span class="k">enabled</span>: <span class="n">true</span>
  <span class="k">host</span>: api.example.com

<span class="c"># templates/deployment.yaml — Helm-ified with helpers, conditionals, whitespace control</span>
<span class="k">apiVersion</span>: apps/v1
<span class="k">kind</span>: Deployment
<span class="k">metadata</span>:
  <span class="k">name</span>: <span class="n">{{ include "api.fullname" . }}</span>
  <span class="k">labels</span>: <span class="n">{{- include "api.labels" . | nindent 4 }}</span>
<span class="k">spec</span>:
  <span class="k">replicas</span>: <span class="n">{{ .Values.replicaCount }}</span>
  <span class="k">selector</span>:
    <span class="k">matchLabels</span>: <span class="n">{{- include "api.selectorLabels" . | nindent 6 }}</span>
  <span class="k">template</span>:
    <span class="k">metadata</span>:
      <span class="k">labels</span>: <span class="n">{{- include "api.selectorLabels" . | nindent 8 }}</span>
    <span class="k">spec</span>:
      <span class="k">containers</span>:
        - <span class="k">name</span>: <span class="s">api</span>
          <span class="k">image</span>: <span class="s">"{{ .Values.image.repository }}:{{ .Values.image.tag }}"</span>
          <span class="k">resources</span>: <span class="n">{{- toYaml .Values.resources | nindent 12 }}</span>
          <span class="n">{{- if .Values.env }}</span>
          <span class="k">env</span>:
            <span class="n">{{- range $k, $v := .Values.env }}</span>
            - { <span class="k">name</span>: <span class="n">{{ $k | quote }}</span>, <span class="k">value</span>: <span class="n">{{ $v | quote }}</span> }
            <span class="n">{{- end }}</span>
          <span class="n">{{- end }}</span>

<span class="c"># Day-to-day</span>
$ helm dependency update ./chart
$ helm template api ./chart -f prod-values.yaml     <span class="c"># preview</span>
$ helm upgrade --install api ./chart -f prod-values.yaml --atomic --wait --timeout 5m
$ helm history api
$ helm rollback api 2                               <span class="c"># undo</span>
$ helm test api                                     <span class="c"># run test hooks</span>`,
      codeCap: 'Helpers keep templates tidy, nindent + toYaml handle whitespace, --atomic makes CI-safe. Chart, values, upgrade, rollback — the four verbs you use daily.',
      quiz: [
        {
          q: 'What is a Helm chart?',
          options: [
            'A dashboard for Kubernetes',
            'A package of templated Kubernetes manifests plus a values file, distributable as a tarball',
            'A CI/CD pipeline definition',
            'A container image format',
          ],
          correct: 1,
          why: 'Think of it as apt/rpm for the cluster: one artifact holds all the manifests for an app.',
        },
        {
          q: 'What is the role of <code>values.yaml</code>?',
          options: [
            'It contains the deployed Kubernetes resources',
            'It provides default configuration that templates read from — overridable at install with --set or -f',
            'It stores the chart\'s dependencies',
            'It\'s the chart\'s changelog',
          ],
          correct: 1,
          why: 'One chart, many values.yaml files — that\'s how you ship the same app to staging and prod with different settings.',
        },
        {
          q: 'What does <code>helm upgrade --install</code> do?',
          options: [
            'Only upgrades — errors if no release exists yet',
            'Installs a new release if none exists, otherwise upgrades — idempotent, safe to run from CI',
            'Uninstalls and reinstalls',
            'Installs only, never upgrades',
          ],
          correct: 1,
          why: 'This is the canonical CI incantation; it doesn\'t care whether it\'s the first run or the hundredth.',
        },
        {
          q: 'How do you undo a bad Helm release?',
          options: [
            'Delete the namespace and start over',
            '<code>helm rollback &lt;release&gt; &lt;revision&gt;</code>',
            'Only by reinstalling from scratch',
            'Roll back the git commit and hope',
          ],
          correct: 1,
          why: 'Helm keeps prior revisions so rollback is one command. Try it before doing anything more dramatic.',
        },
        {
          q: 'Which templating engine does Helm use?',
          options: [
            'Jinja2',
            'Go text/template with the Sprig function library',
            'Handlebars',
            'Mustache',
          ],
          correct: 1,
          why: 'That\'s why you see {{ .Values.foo }} — Go template syntax. Sprig adds functions like `default`, `quote`, `trunc`.',
        },
      ],
    },

    {
      id: 'terraform',
      part: 3,
      num: '15',
      title: 'Terraform',
      tag: 'Describe the infrastructure you want; a plan tells you how to get there — providers, state, modules, workspaces, drift.',
      figure: {
        tag: 'Figure 1 · Plan is a three-way diff',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="30" y="30" width="150" height="70"/>
            <text x="105" y="52" text-anchor="middle" font-size="11" font-weight="700" stroke="none">.tf files</text>
            <text x="105" y="68" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">what you want</text>
            <text x="105" y="86" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">version-controlled</text>

            <rect x="230" y="30" width="150" height="70"/>
            <text x="305" y="52" text-anchor="middle" font-size="11" font-weight="700" stroke="none">terraform.tfstate</text>
            <text x="305" y="68" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">what Terraform thinks</text>
            <text x="305" y="86" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">exists (last apply)</text>

            <rect x="430" y="30" width="150" height="70"/>
            <text x="505" y="52" text-anchor="middle" font-size="11" font-weight="700" stroke="none">cloud APIs</text>
            <text x="505" y="68" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">what actually exists</text>
            <text x="505" y="86" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">right now</text>
          </g>

          <g stroke="currentColor" fill="none" stroke-dasharray="3 3">
            <path d="M 105 100 L 305 140"/>
            <path d="M 305 100 L 305 140"/>
            <path d="M 505 100 L 305 140"/>
          </g>

          <g>
            <rect x="230" y="140" width="150" height="46" stroke="var(--accent)"/>
            <text x="305" y="162" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">terraform plan</text>
            <text x="305" y="178" text-anchor="middle" font-size="9" stroke="none" class="fig-em">the diff · read before apply</text>
          </g>

          <path d="M 305 186 L 305 210" stroke="currentColor"/><polygon points="305,210 302,204 308,204" fill="currentColor"/>
          <g>
            <rect x="230" y="212" width="150" height="34"/>
            <text x="305" y="234" text-anchor="middle" font-size="11" font-weight="700" stroke="none">terraform apply</text>
          </g>

          <text x="30" y="240" font-size="9" stroke="none" class="fig-muted">state locked during apply (DynamoDB / TF Cloud)</text>
        </svg>`,
        caption: 'Plan is a three-way diff between your code, Terraform\'s state, and cloud reality. Apply executes the plan and updates state. State is precious — corrupt it and Terraform forgets what it owns; lock it during apply so two people can\'t race.',
      },
      intro: `Terraform is HashiCorp's language and engine for provisioning infrastructure declaratively. You write <code>.tf</code> files in HCL, run <code>terraform plan</code> to see what will change, and <code>terraform apply</code> to make it so. The scope is broader than Kubernetes — Terraform provisions the cluster itself, the VPC around it, the DNS zone in front, the S3 buckets it uses, the IAM roles that let it authenticate.
The essential trick is the <em>state file</em>: a JSON record of every resource Terraform has ever created and its current attributes. Every plan is a three-way diff between your <code>.tf</code> code (what you want), the state (what Terraform believes exists), and the real world (what the cloud API returns). Losing state is losing Terraform’s memory of what it owns.
OpenTofu is the community fork of Terraform that arose after HashiCorp changed the licence; for most purposes the two are interchangeable today.`,
      concepts: [
        ['HCL', "HashiCorp Configuration Language. Blocks, arguments, and expressions. <code>resource \"type\" \"name\" { ... }</code>, <code>variable \"name\" { type = string }</code>, <code>output \"x\" { value = ... }</code>. Interpolation with <code>\"${aws_vpc.main.id}\"</code> — or in modern Terraform, just <code>aws_vpc.main.id</code>."],
        ['Provider', "A plugin that translates HCL resource types into API calls against a specific platform. Hundreds exist: <code>aws</code>, <code>google</code>, <code>azurerm</code>, <code>kubernetes</code>, <code>helm</code>, <code>github</code>, <code>cloudflare</code>, <code>datadog</code>, <code>vault</code>. Version-pin each in <code>required_providers</code> to avoid surprise upgrades."],
        ['Resource', "A single managed object. <code>resource \"aws_s3_bucket\" \"logs\" { bucket = \"acme-logs-prod\" }</code> declares one bucket that Terraform will create, update, or destroy to match the config. Resources reference each other by <code>type.name.attribute</code>, and Terraform builds a dependency graph automatically."],
        ['Data source', "Read-only lookups. <code>data \"aws_ami\" \"ubuntu\" { ... }</code> fetches info without managing it. Useful for referring to things another team owns or that pre-existed."],
        ['State & remote backends', "The <em>state file</em> (<code>terraform.tfstate</code>) maps your code to real objects. Local by default; production teams put it in a <em>remote backend</em>: S3+DynamoDB (AWS), GCS, Azure Blob, Terraform Cloud. Locking (via DynamoDB or backend feature) prevents two engineers <code>apply</code>ing at once."],
        ['Plan & apply', "Two-phase change. <code>terraform plan</code> computes and prints the diff without changing anything. <code>terraform apply</code> re-plans and executes. <em>Always</em> read the plan before applying. Save with <code>-out plan.tfplan</code> for CI to apply exactly the reviewed plan."],
        ['Variables & outputs', "<code>variable \"region\" { type = string, default = \"eu-west-1\" }</code>. Set via CLI (<code>-var region=us-east-1</code>), file (<code>terraform.tfvars</code>), or env (<code>TF_VAR_region</code>). <code>output \"vpc_id\" { value = aws_vpc.main.id }</code> exposes values for other stacks to consume."],
        ['Modules', "A reusable directory of Terraform code that takes input variables and produces outputs. <code>module \"vpc\" { source = \"./modules/vpc\", cidr = \"10.0.0.0/16\" }</code>. Public modules on the Terraform Registry (<code>terraform-aws-modules/vpc/aws</code>) save you weeks."],
        ['Workspaces vs directory-per-env', "Two ways to isolate environments. <em>Workspaces</em>: same code, separate state per workspace (<code>terraform workspace new prod</code>). Simpler; risk that a single mistake affects the wrong env. <em>Directory-per-env</em>: <code>envs/dev/</code>, <code>envs/prod/</code>, each with its own backend config. Clearer blast radius; more code duplication. Most teams pick directory-per-env for production."],
        ['for_each & count', "Create many resources from a map or list. <code>resource \"aws_iam_user\" \"u\" { for_each = toset([\"alice\",\"bob\"]) ; name = each.key }</code> is safer than <code>count</code> (reordering doesn’t destroy resources). Prefer <code>for_each</code>."],
        ['Import & moved blocks', "<code>terraform import aws_s3_bucket.logs acme-logs-prod</code> brings an existing (manually-created) resource under management by writing it into state. You still author the matching HCL. <code>moved { from = ... to = ... }</code> tells Terraform a resource was renamed so it re-parents state without destroying and recreating."],
        ['Drift & taint', "<em>Drift</em>: someone changed the resource in the cloud console. Next <code>plan</code> shows the diff. Fix by updating code to match, reverting the manual change, or <code>terraform apply -refresh-only</code>. <em>Taint</em>: mark a resource to be destroyed and recreated on next apply (<code>-replace=aws_instance.web</code> in modern Terraform)."],
      ],
      code: `<span class="c"># main.tf — the shape you actually use</span>
<span class="k">terraform</span> {
  <span class="k">required_version</span> = <span class="s">"~&gt; 1.7"</span>
  <span class="k">required_providers</span> {
    <span class="k">aws</span> = { <span class="k">source</span> = <span class="s">"hashicorp/aws"</span>, <span class="k">version</span> = <span class="s">"~&gt; 5.0"</span> }
  }
  <span class="k">backend</span> <span class="s">"s3"</span> {
    <span class="k">bucket</span>         = <span class="s">"acme-tf-state"</span>
    <span class="k">key</span>            = <span class="s">"envs/prod/network.tfstate"</span>
    <span class="k">region</span>         = <span class="s">"eu-west-1"</span>
    <span class="k">dynamodb_table</span> = <span class="s">"acme-tf-lock"</span>       <span class="c"># locking</span>
    <span class="k">encrypt</span>        = <span class="n">true</span>
  }
}

<span class="k">provider</span> <span class="s">"aws"</span> {
  <span class="k">region</span> = var.region
  <span class="k">default_tags</span> { <span class="k">tags</span> = { <span class="k">env</span> = var.env, <span class="k">managed_by</span> = <span class="s">"terraform"</span> } }
}

<span class="k">variable</span> <span class="s">"region"</span> { <span class="k">type</span> = string, <span class="k">default</span> = <span class="s">"eu-west-1"</span> }
<span class="k">variable</span> <span class="s">"env"</span>    { <span class="k">type</span> = string }

<span class="k">module</span> <span class="s">"vpc"</span> {
  <span class="k">source</span>   = <span class="s">"terraform-aws-modules/vpc/aws"</span>
  <span class="k">version</span>  = <span class="s">"~&gt; 5.0"</span>
  <span class="k">name</span>     = <span class="s">"acme-\${var.env}"</span>
  <span class="k">cidr</span>     = <span class="s">"10.0.0.0/16"</span>
  <span class="k">azs</span>      = [<span class="s">"eu-west-1a"</span>, <span class="s">"eu-west-1b"</span>, <span class="s">"eu-west-1c"</span>]
  <span class="k">private_subnets</span> = [<span class="s">"10.0.1.0/24"</span>, <span class="s">"10.0.2.0/24"</span>, <span class="s">"10.0.3.0/24"</span>]
  <span class="k">public_subnets</span>  = [<span class="s">"10.0.101.0/24"</span>, <span class="s">"10.0.102.0/24"</span>, <span class="s">"10.0.103.0/24"</span>]
  <span class="k">enable_nat_gateway</span> = <span class="n">true</span>
  <span class="k">single_nat_gateway</span> = <span class="n">true</span>                        <span class="c"># dev: 1; prod: false = 1 per AZ</span>
}

<span class="k">output</span> <span class="s">"vpc_id"</span> { <span class="k">value</span> = module.vpc.vpc_id }

<span class="c"># Day-to-day</span>
$ terraform init                                        <span class="c"># download providers + configure backend</span>
$ terraform fmt -recursive
$ terraform validate
$ terraform plan -out tfplan
$ terraform apply tfplan                                <span class="c"># apply exactly the plan you reviewed</span>
$ terraform state list
$ terraform state show module.vpc.aws_vpc.this[0]
$ terraform import aws_route53_zone.main Z1234ABC       <span class="c"># adopt existing resource</span>
$ terraform apply -replace=aws_instance.web              <span class="c"># force recreate one resource</span>`,
      codeCap: 'Backend with locking, provider with default tags, a public module for the VPC, output for the next stack. init → fmt → validate → plan → apply is the discipline.',
      quiz: [
        {
          q: 'What does <code>terraform plan</code> do?',
          options: [
            'Applies changes to the cloud immediately',
            'Computes and prints the diff between your code, the state, and the real infrastructure — without making any changes',
            'Deletes every managed resource',
            'Downloads provider plugins',
          ],
          correct: 1,
          why: 'plan is your last look before commitment; read it every time.',
        },
        {
          q: 'What is the Terraform state file?',
          options: [
            'A cache you can safely delete whenever',
            'A mapping between your Terraform code and the real-world resources it manages, tracking their current attributes',
            'The provider\'s log file',
            'A backup of your .tf files',
          ],
          correct: 1,
          why: 'Losing state means Terraform no longer knows what it owns; treat it as precious and back it up.',
        },
        {
          q: 'Why store Terraform state in a remote backend?',
          options: [
            'To make it slower and more secure',
            'So teammates share the same state and locking prevents two people from applying at once',
            'It\'s legally required',
            'Local state does not exist',
          ],
          correct: 1,
          why: 'S3 + DynamoDB locking is the classic AWS pattern; Terraform Cloud does it for you.',
        },
        {
          q: 'What is a Terraform provider?',
          options: [
            'A cloud vendor account',
            'A plugin that translates HCL resource definitions into API calls against a specific platform',
            'A backup service',
            'A UI for terraform',
          ],
          correct: 1,
          why: 'Every resource type comes from some provider — that\'s the plugin doing the actual API calls.',
        },
        {
          q: 'What does <code>terraform import</code> do?',
          options: [
            'Imports another .tf file into the current one',
            'Brings an existing resource (created manually or by another tool) under Terraform management by writing it into state',
            'Imports modules from the registry',
            'Downloads provider plugins',
          ],
          correct: 1,
          why: 'You still have to write the matching HCL yourself; import only fills in the state row.',
        },
      ],
    },

    {
      id: 'ansible',
      part: 3,
      num: '16',
      title: 'Ansible',
      tag: 'Configuration management, agentless and stateless — SSH, YAML, and modules that check before they act.',
      figure: {
        tag: 'Figure 1 · Playbook layout',
        svg: `<svg class="figure-svg" viewBox="0 0 620 300" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="30" width="180" height="240"/>
            <text x="110" y="50" text-anchor="middle" font-size="11" font-weight="700" stroke="none">inventory</text>
            <text x="30" y="76" font-size="10" stroke="none">[web]</text>
            <text x="30" y="90" font-size="9" stroke="none" class="fig-muted">web01 · web02 · web03</text>
            <text x="30" y="112" font-size="10" stroke="none">[db]</text>
            <text x="30" y="126" font-size="9" stroke="none" class="fig-muted">db-primary</text>
            <text x="30" y="150" font-size="10" stroke="none">group_vars/</text>
            <text x="30" y="164" font-size="9" stroke="none" class="fig-muted">all.yml</text>
            <text x="30" y="178" font-size="9" stroke="none" class="fig-muted">web.yml</text>
            <text x="30" y="192" font-size="9" stroke="none" class="fig-em">prod_vault.yml 🔒</text>
            <text x="30" y="216" font-size="10" stroke="none">host_vars/</text>
            <text x="30" y="230" font-size="9" stroke="none" class="fig-muted">db-primary.yml</text>
          </g>

          <path d="M 200 150 L 238 150" stroke="currentColor"/><polygon points="238,150 233,147 233,153" fill="currentColor"/>

          <g>
            <rect x="240" y="30" width="180" height="240"/>
            <text x="330" y="50" text-anchor="middle" font-size="11" font-weight="700" stroke="none">site.yml + roles/</text>
            <text x="250" y="76" font-size="9" stroke="none" class="fig-muted">- hosts: web</text>
            <text x="250" y="90" font-size="9" stroke="none" class="fig-muted">  roles: [nginx, app]</text>
            <text x="250" y="112" font-size="10" stroke="none">roles/nginx/</text>
            <text x="260" y="126" font-size="9" stroke="none" class="fig-muted">tasks/main.yml</text>
            <text x="260" y="140" font-size="9" stroke="none" class="fig-muted">handlers/main.yml</text>
            <text x="260" y="154" font-size="9" stroke="none" class="fig-muted">templates/*.j2</text>
            <text x="260" y="168" font-size="9" stroke="none" class="fig-muted">defaults/main.yml</text>
            <text x="250" y="200" font-size="10" stroke="none">tags: [nginx, config]</text>
          </g>

          <path d="M 420 150 L 458 150" stroke="currentColor"/><polygon points="458,150 453,147 453,153" fill="currentColor"/>

          <g>
            <rect x="460" y="30" width="140" height="240" stroke="var(--accent)"/>
            <text x="530" y="50" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">SSH → host</text>
            <text x="530" y="78" text-anchor="middle" font-size="9" stroke="none" class="fig-em">stateless</text>
            <text x="530" y="94" text-anchor="middle" font-size="9" stroke="none" class="fig-em">agentless</text>
            <text x="530" y="118" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">module runs on target,</text>
            <text x="530" y="132" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">checks first, then acts</text>
            <text x="530" y="156" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">changed=false → idempotent</text>
            <text x="530" y="184" text-anchor="middle" font-size="10" font-weight="700" stroke="none">--check --diff</text>
            <text x="530" y="198" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">dry-run + preview</text>
          </g>
        </svg>`,
        caption: 'The four ingredients: inventory says who, group_vars say what, playbook + roles say how, SSH does the work. No agent on the target, no state database — every run recomputes desired state, modules ask "is this already true?" before acting.',
      },
      intro: `Ansible describes how you want a set of machines to be configured — packages installed, files rendered, services running, users created — in ordinary YAML, then makes each machine match by connecting over SSH and running Python modules on the far side. There is no daemon to install on the target, and no database keeping track of state.
This makes Ansible <em>stateless</em>: every run recomputes desired state from the code and inventory, connects to each host, asks each module "is this already true?", and only acts when it isn\'t. That property — combined with idempotency and its flat learning curve — is why Ansible has stuck around while flashier tools have come and gone.`,
      concepts: [
        ['Stateless & agentless', "No agent on managed hosts, no state file, no central database. Each <code>ansible-playbook</code> invocation reads the code + inventory, SSHes out, and reconciles. Kill the control machine, spin up a new one, re-run the same playbook — same result. This is fundamentally different from Terraform (which has state) or Puppet (which has an agent daemon)."],
        ['Inventory', "The list of hosts Ansible manages, grouped for reuse. Static (INI/YAML in <code>hosts.yml</code>) or dynamic (a script that queries AWS/GCP/Azure and returns the current fleet). Example groups: <code>[web]</code>, <code>[db]</code>, <code>[web:vars]</code>."],
        ['group_vars & host_vars', "Directories next to your inventory that hold per-group and per-host variables. <code>group_vars/web.yml</code> applies to every host in the <code>web</code> group. <code>host_vars/db-1.example.com.yml</code> applies to that one host. Ansible auto-loads them by name — no <code>include_vars</code> needed."],
        ['Playbook', "The top-level YAML file that binds plays (host + tasks) together. <code>ansible-playbook -i inventory site.yml</code> is the day-to-day command. Plays run top-to-bottom; tasks within a play run in order across all hosts in parallel (default 5 forks)."],
        ['Task & Module', "A task calls a module (<code>apt</code>, <code>copy</code>, <code>template</code>, <code>systemd</code>, <code>user</code>, <code>lineinfile</code>, <code>command</code>, <code>uri</code>...) with parameters. Modules ship as Python, are copied to the target, run once, return JSON. Idempotent modules check before they act; <code>command</code> and <code>shell</code> do not — they always run."],
        ['Role', "A structured directory Ansible auto-discovers by convention: <code>tasks/</code>, <code>handlers/</code>, <code>templates/</code>, <code>files/</code>, <code>vars/</code>, <code>defaults/</code>, <code>meta/</code>. Playbooks include roles (<code>roles: [nginx, postgres]</code>) rather than restating them. Roles are how playbooks stay short and shareable."],
        ['Handler', "A task that only runs when another task <code>notify</code>s it, and only once per play even if notified many times. Classic use: restart the service <em>only</em> if the config template actually changed."],
        ['Ansible Vault', "Encrypts secrets at rest inside your repo. <code>ansible-vault encrypt group_vars/prod.yml</code> converts sensitive vars into a single ciphertext blob decryptable by <code>--ask-vault-pass</code> or a password file. Encrypted files are safe to commit; playbooks read decrypted values transparently at run time."],
        ['Jinja2 templating', "Variables (<code>{{ nginx_port }}</code>), filters (<code>{{ password | b64encode }}</code>), conditionals (<code>{% if env == \"prod\" %}</code>), loops (<code>{% for u in users %}</code>) — Ansible uses Jinja2 in templates and task expressions alike. <code>{% ... %}</code> for statements, <code>{{ ... }}</code> for values."],
        ['Tags & <code>--check</code>', "Tag tasks (<code>tags: [nginx, config]</code>) and target subsets with <code>--tags nginx</code>. <code>--check</code> is dry-run: connect, evaluate, report what <em>would</em> change, without changing anything. Pair with <code>--diff</code> to see file contents that would change."],
        ['Idempotency', "The whole point. Well-written modules check current state before acting; nothing changes when nothing needs to. First run: many changed lines. Second run: all OK, zero changed. If your playbook reports changed on every run, a task is misbehaving — usually a <code>command</code> or <code>shell</code> without <code>creates:</code>/<code>removes:</code> guards."],
      ],
      code: `<span class="c"># Project layout — the shape you settle into</span>
<span class="c"># .</span>
<span class="c"># ├── inventory/</span>
<span class="c"># │   ├── prod.yml            # hosts, grouped</span>
<span class="c"># │   └── group_vars/</span>
<span class="c"># │       ├── all.yml         # applies to every host</span>
<span class="c"># │       ├── web.yml         # applies to [web]</span>
<span class="c"># │       └── prod_vault.yml  # ansible-vault-encrypted secrets</span>
<span class="c"># ├── roles/</span>
<span class="c"># │   └── nginx/</span>
<span class="c"># │       ├── tasks/main.yml</span>
<span class="c"># │       ├── handlers/main.yml</span>
<span class="c"># │       ├── templates/nginx.conf.j2</span>
<span class="c"># │       └── defaults/main.yml</span>
<span class="c"># └── site.yml</span>

<span class="c"># site.yml — one play, two roles, tagged tasks</span>
- <span class="k">hosts</span>: <span class="s">web</span>
  <span class="k">become</span>: <span class="n">true</span>
  <span class="k">roles</span>:
    - { <span class="k">role</span>: <span class="s">nginx</span>,   <span class="k">tags</span>: [<span class="s">nginx</span>] }
    - { <span class="k">role</span>: <span class="s">app</span>,     <span class="k">tags</span>: [<span class="s">app</span>] }

<span class="c"># roles/nginx/tasks/main.yml — idempotent, notifies a handler</span>
- <span class="k">name</span>: <span class="s">Install nginx</span>
  <span class="k">apt</span>: { <span class="k">name</span>: <span class="s">nginx</span>, <span class="k">state</span>: <span class="s">present</span>, <span class="k">update_cache</span>: <span class="n">true</span> }

- <span class="k">name</span>: <span class="s">Render site config from template</span>
  <span class="k">template</span>:
    <span class="k">src</span>: <span class="s">nginx.conf.j2</span>
    <span class="k">dest</span>: <span class="s">/etc/nginx/sites-enabled/site.conf</span>
    <span class="k">owner</span>: <span class="s">root</span>
    <span class="k">mode</span>: <span class="s">'0644'</span>
  <span class="k">notify</span>: <span class="s">reload nginx</span>

<span class="c"># Day-to-day incantations</span>
$ ansible-playbook -i inventory/prod.yml site.yml
$ ansible-playbook -i inventory/prod.yml site.yml --tags nginx --check --diff
$ ansible-vault edit inventory/group_vars/prod_vault.yml
$ ansible web -i inventory/prod.yml -m ping    <span class="c"># ad-hoc: are they reachable?</span>`,
      codeCap: 'Directory shape does the work: group_vars auto-apply per group, roles auto-discover their own subfolders, Vault-encrypted files are read transparently. No plumbing.',
      quiz: [
        {
          q: 'What does it mean that Ansible is "stateless"?',
          options: [
            'It cannot store variables',
            "It keeps no database or state file of what it has done — every run reads the code and inventory from scratch, connects to each host, and reconciles. Kill the control machine and re-run: same result.",
            'It only manages stateless applications',
            'It is deprecated',
          ],
          correct: 1,
          why: "This is the mental model difference between Ansible and Terraform. Terraform's plan is a diff against state; Ansible's is a diff computed live from the target hosts.",
        },
        {
          q: 'What does <code>group_vars/web.yml</code> do?',
          options: [
            'Nothing special',
            'Auto-applies its variables to every host in the <code>web</code> inventory group — no <code>include_vars</code> or <code>vars_files</code> needed',
            'Overrides all roles',
            'Encrypts secrets',
          ],
          correct: 1,
          why: 'Filename convention drives variable scoping — <code>host_vars/&lt;hostname&gt;.yml</code> works the same way per-host.',
        },
        {
          q: 'What is Ansible Vault for?',
          options: [
            'Backing up playbooks',
            'Encrypting sensitive variables at rest so they can be committed to git; decrypted transparently at run time with a password (or a password file / cloud-KMS wrapper)',
            'Storing playbook history',
            'Auto-generating passwords',
          ],
          correct: 1,
          why: '<code>ansible-vault encrypt/decrypt/edit/view</code>. Pair with a keyring or cloud KMS for real production use.',
        },
        {
          q: 'A handler in Ansible runs when…',
          options: [
            'Every time a play runs',
            "Another task <code>notify</code>s it — and only once per play, even if notified many times. Classic use: reload nginx only if the config template actually changed.",
            'Only on Sundays',
            'Never — handlers are deprecated',
          ],
          correct: 1,
          why: 'Handlers run at the end of the play by default. Force earlier with <code>meta: flush_handlers</code>.',
        },
        {
          q: 'What is idempotency in Ansible, in one sentence?',
          options: [
            'A module type',
            "Running the same playbook multiple times converges to the same end state — modules check current state and only act when reality doesn't match the desired state",
            'A network protocol',
            'A YAML dialect',
          ],
          correct: 1,
          why: 'A second run showing all "OK, changed=0" is the goal. Every "changed" on a re-run is a task worth investigating.',
        },
        {
          q: 'You want to test what a playbook <em>would</em> do without changing anything. Which flags?',
          options: [
            '<code>--dry</code> and <code>--simulate</code>',
            '<code>--check --diff</code> — check performs a dry run against real hosts; diff shows the file/template deltas that would happen',
            '<code>--noop</code>',
            'You cannot dry-run Ansible',
          ],
          correct: 1,
          why: 'Not every module supports check mode; ones that don\'t are skipped and reported.',
        },
      ],
    },

    {
      id: 'argocd',
      part: 2,
      num: '12',
      title: 'ArgoCD & GitOps',
      tag: 'Git holds desired state; a controller keeps the cluster in agreement — drift, sync waves, App of Apps, ApplicationSets.',
      figure: {
        tag: 'Figure 1 · The GitOps reconciliation loop',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="30" y="90" width="150" height="80"/>
            <text x="105" y="115" text-anchor="middle" font-size="12" font-weight="700" stroke="none">Git repo</text>
            <text x="105" y="132" text-anchor="middle" font-size="9" stroke="none" class="fig-em">source of truth</text>
            <text x="105" y="148" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">envs/prod/api/*.yaml</text>
          </g>

          <g>
            <rect x="240" y="90" width="150" height="80" stroke="var(--accent)"/>
            <text x="315" y="115" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">ArgoCD</text>
            <text x="315" y="132" text-anchor="middle" font-size="9" stroke="none" class="fig-em">controller · in cluster</text>
            <text x="315" y="148" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">watches · compares · syncs</text>
          </g>

          <g>
            <rect x="450" y="90" width="150" height="80"/>
            <text x="525" y="115" text-anchor="middle" font-size="12" font-weight="700" stroke="none">Kubernetes</text>
            <text x="525" y="132" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">actual state</text>
            <text x="525" y="148" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">Deployments / Services</text>
          </g>

          <g fill="currentColor">
            <path d="M 180 122 L 238 122" stroke="currentColor"/><polygon points="238,122 233,119 233,125"/>
            <text x="210" y="115" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">pull</text>

            <path d="M 390 122 L 448 122" stroke="currentColor"/><polygon points="448,122 443,119 443,125"/>
            <text x="420" y="115" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">apply</text>

            <!-- Drift arrow (feedback) -->
            <path d="M 525 170 Q 525 220 315 220 Q 105 220 105 170" stroke="var(--accent)" stroke-dasharray="4 4" fill="none"/>
            <polygon points="105,175 102,168 108,168" fill="var(--accent)"/>
            <text x="315" y="240" text-anchor="middle" font-size="10" stroke="none" fill="var(--accent)" font-weight="700">drift detected → self-heal reverts to Git</text>
          </g>

          <text x="30" y="52" font-size="9" font-weight="700" letter-spacing="0.2em" stroke="none" class="fig-muted">GITOPS: GIT DECLARES · A CONTROLLER RECONCILES · REALITY MATCHES</text>
        </svg>`,
        caption: 'The controller lives inside the cluster and continuously compares. When someone kubectl-edits a resource, Argo notices the diff and — with self-heal on — reverts it to what Git says. Merging a PR is the only real way to change production.',
      },
      intro: `GitOps takes CI/CD\'s "declarative pipeline" idea to its logical end: the desired state of your infrastructure lives in a Git repository, and a controller inside the cluster continuously reconciles the running cluster to match. If Git says three replicas, three replicas there will be — and if someone edits the Deployment by hand, ArgoCD will notice the drift and (with self-heal) revert it.
The consequence is that <em>Git becomes the deployment interface</em>. Merging a PR is deploying. Reverting a commit is rolling back. Access control is who can commit to which paths. It’s the same discipline as CI/CD, just with a controller pulling from Git rather than a pipeline pushing to the cluster.
ArgoCD is the most-used implementation for Kubernetes; <em>Flux</em> is the other major one, favoured by teams that want Git operations to feel more like <code>kubectl apply</code>.`,
      concepts: [
        ['Source of truth', "Not the cluster, not a ticket, not a Slack thread — the Git repo. If it’s not in Git, it isn’t real. This changes how you operate: no more <code>kubectl edit</code> on prod (that’s drift); no more “I hotfixed this on the cluster” — you commit the fix."],
        ['Application (CRD)', "An ArgoCD <code>Application</code> object points at a Git repo, a path (folder), a revision (branch/tag/SHA), and a destination cluster/namespace. That’s “an app” in Argo’s eyes — Argo watches the source and reconciles the destination to match."],
        ['Sync policies', "How aggressively Argo enforces Git. <em>Manual</em>: shows drift, requires a human click. <em>Automated</em>: syncs on every commit that changes the source. Nested toggles: <code>prune</code> (delete resources removed from Git), <code>selfHeal</code> (revert manual cluster changes)."],
        ['Sync waves & hooks', "Argo applies resources in <em>waves</em> (annotation <code>argocd.argoproj.io/sync-wave: \"-1\"</code>) so infrastructure (CRDs, namespaces) applies before workloads. <em>PreSync / PostSync / SyncFail hooks</em>: Jobs that run at the right lifecycle point, useful for migrations and smoke tests."],
        ['Drift & self-heal', "Argo continuously compares Git desired state to cluster live state. Diverged? Marked <em>OutOfSync</em>. With <code>selfHeal: true</code>, Argo will re-apply Git; without it, you get a red status and a diff, and you decide."],
        ['Auto-prune', "When you delete a manifest from Git, do you want Argo to delete the corresponding cluster resource? <code>prune: true</code> says yes. Default is no — because “I removed a file by accident” shouldn’t mean “production is gone.” In real production, prune=true with careful review is standard."],
        ['App of Apps', "A pattern: one root <code>Application</code> whose Git path contains <em>other</em> Application manifests. Deploy the root; it deploys the rest. Combined with <em>ApplicationSets</em> (below), the GitOps way to bootstrap a whole cluster from a single commit."],
        ['ApplicationSet', "A generator that produces many Applications from a template — one per cluster, one per environment, one per tenant, one per Git directory. Loops over clusters (list, cluster generator), Git repos (git-file, git-directory), matrices, and merges. The scale answer."],
        ['Repo structure', "Common shape: one repo of manifests (or Helm/Kustomize sources), split by environment (<code>envs/dev</code>, <code>envs/staging</code>, <code>envs/prod</code>) and app (<code>apps/api</code>). Argo Applications point at specific paths. Promotions = PRs that copy manifests from one env folder to the next."],
        ['Helm & Kustomize sources', "Argo natively renders Helm charts and Kustomize overlays before applying. <code>source.helm.values</code>, <code>source.kustomize.namePrefix</code>, etc. You keep charts/overlays in git; Argo does the render at sync time."],
        ['Secrets in GitOps', "Never plaintext in Git. Options: [[secrets]] Sealed Secrets (encrypted manifests safe to commit), SOPS-encrypted files with Argo’s SOPS plugin, or an External Secrets Operator that syncs from Vault/AWS Secrets Manager/etc."],
        ['Multi-cluster', "One Argo can manage many clusters. <code>argocd cluster add</code> registers a target; Applications specify their <code>destination.server</code>. Combined with ApplicationSets, one repo can drive dozens of clusters consistently."],
      ],
      code: `<span class="c"># An ArgoCD Application manifest — auto-sync, self-heal, prune</span>
<span class="k">apiVersion</span>: argoproj.io/v1alpha1
<span class="k">kind</span>: Application
<span class="k">metadata</span>:
  <span class="k">name</span>: <span class="s">api-prod</span>
  <span class="k">namespace</span>: <span class="s">argocd</span>
<span class="k">spec</span>:
  <span class="k">project</span>: <span class="s">default</span>
  <span class="k">source</span>:
    <span class="k">repoURL</span>: <span class="s">https://github.com/acme/deploy.git</span>
    <span class="k">path</span>: <span class="s">envs/prod/api</span>
    <span class="k">targetRevision</span>: <span class="s">main</span>
    <span class="k">helm</span>:
      <span class="k">valueFiles</span>: [values.yaml, values-prod.yaml]
  <span class="k">destination</span>:
    <span class="k">server</span>: <span class="s">https://kubernetes.default.svc</span>
    <span class="k">namespace</span>: <span class="s">prod</span>
  <span class="k">syncPolicy</span>:
    <span class="k">automated</span>: { <span class="k">prune</span>: <span class="n">true</span>, <span class="k">selfHeal</span>: <span class="n">true</span> }
    <span class="k">syncOptions</span>: [CreateNamespace=true, ServerSideApply=true]

---
<span class="c"># ApplicationSet — one Application per env folder, generated automatically</span>
<span class="k">apiVersion</span>: argoproj.io/v1alpha1
<span class="k">kind</span>: ApplicationSet
<span class="k">metadata</span>: { <span class="k">name</span>: <span class="s">api-envs</span>, <span class="k">namespace</span>: <span class="s">argocd</span> }
<span class="k">spec</span>:
  <span class="k">generators</span>:
    - <span class="k">git</span>:
        <span class="k">repoURL</span>: <span class="s">https://github.com/acme/deploy.git</span>
        <span class="k">revision</span>: <span class="s">main</span>
        <span class="k">directories</span>: [{ <span class="k">path</span>: <span class="s">envs/*/api</span> }]
  <span class="k">template</span>:
    <span class="k">metadata</span>: { <span class="k">name</span>: <span class="s">api-{{path.basename}}</span> }
    <span class="k">spec</span>:
      <span class="k">source</span>:      { <span class="k">repoURL</span>: <span class="s">https://github.com/acme/deploy.git</span>, <span class="k">path</span>: <span class="s">"{{path}}"</span>, <span class="k">targetRevision</span>: <span class="s">main</span> }
      <span class="k">destination</span>: { <span class="k">server</span>: <span class="s">https://kubernetes.default.svc</span>, <span class="k">namespace</span>: <span class="s">"{{path.basename}}"</span> }
      <span class="k">syncPolicy</span>:  { <span class="k">automated</span>: { <span class="k">selfHeal</span>: <span class="n">true</span> } }`,
      codeCap: 'One Application for prod, an ApplicationSet that generates one per env directory. Commit a new folder — Argo makes an Application for it automatically.',
      quiz: [
        {
          q: 'What is GitOps, in one sentence?',
          options: [
            'Storing your source code in Git',
            'Using a Git repo as the single source of truth for desired state, with a controller reconciling actual state to match',
            'A branch named "ops"',
            'Letting only the ops team commit',
          ],
          correct: 1,
          why: 'The point is not just that Git holds the manifests — it\'s that a controller acts on them without any external CD system pushing.',
        },
        {
          q: 'What does ArgoCD do when it detects drift between Git and the cluster?',
          options: [
            'Deletes the cluster',
            'Depending on sync policy: reports it (manual) or automatically reconciles back to Git (self-heal)',
            'Rewrites Git to match the cluster',
            'Nothing — drift is silent',
          ],
          correct: 1,
          why: 'The controller\'s job is to close that gap. You choose whether it needs your permission.',
        },
        {
          q: 'What is an ArgoCD Application?',
          options: [
            'A container image',
            'A CRD that ties a Git source (repo, path, revision) to a Kubernetes destination and defines sync behaviour',
            'A user account in ArgoCD',
            'A namespace',
          ],
          correct: 1,
          why: 'Everything Argo manages is expressed as an Application (or an ApplicationSet, which generates many).',
        },
        {
          q: 'What does "auto-prune" do?',
          options: [
            'Deletes old container images from the registry',
            'When a manifest is removed from Git, deletes the corresponding cluster resource',
            'Compacts the git repository',
            'Trims log files inside pods',
          ],
          correct: 1,
          why: 'Off by default — because "I deleted a file by accident" then means "prod is gone" if it were on.',
        },
        {
          q: 'Where should production secrets NOT be stored?',
          options: [
            'In a secret manager (Vault, AWS Secrets Manager, GCP Secret Manager)',
            'Plain text in the Git repo that ArgoCD reads',
            'Encrypted with SOPS or as sealed-secrets in Git',
            'As Kubernetes Secrets injected at runtime by a controller',
          ],
          correct: 1,
          why: 'GitOps + plaintext secrets is a leak waiting to happen. Use sealed-secrets, SOPS, or an external secret operator.',
        },
      ],
    },

    {
      id: 'monitoring',
      part: 5,
      num: '26',
      title: 'Metrics & Prometheus',
      tag: 'Time series, PromQL, exporters, cardinality, SLOs, alerting — the metrics half of observability.',
      figure: {
        tag: 'Figure 1 · Pull-based scraping',
        svg: `<svg class="figure-svg" viewBox="0 0 620 240" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="90" width="150" height="70" stroke="var(--accent)"/>
            <text x="95" y="112" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">Prometheus</text>
            <text x="95" y="130" text-anchor="middle" font-size="9" stroke="none" class="fig-em">scrape every 15s</text>
            <text x="95" y="146" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">store TSDB · alert · query</text>
          </g>

          <g stroke="currentColor" fill="none">
            <path d="M 170 105 L 218 60"/><polygon points="218,60 211,60 213,66" fill="currentColor"/>
            <path d="M 170 125 L 218 125"/><polygon points="218,125 213,122 213,128" fill="currentColor"/>
            <path d="M 170 145 L 218 190"/><polygon points="218,190 211,190 213,184" fill="currentColor"/>
          </g>
          <text x="192" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">GET /metrics</text>

          <g>
            <rect x="220" y="35" width="180" height="50"/>
            <text x="310" y="57" text-anchor="middle" font-size="10" font-weight="700" stroke="none">app · exposes /metrics</text>
            <text x="310" y="73" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">counter, gauge, histogram</text>

            <rect x="220" y="100" width="180" height="50"/>
            <text x="310" y="122" text-anchor="middle" font-size="10" font-weight="700" stroke="none">node_exporter</text>
            <text x="310" y="138" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">host CPU · mem · disk · net</text>

            <rect x="220" y="165" width="180" height="50"/>
            <text x="310" y="187" text-anchor="middle" font-size="10" font-weight="700" stroke="none">kube-state-metrics</text>
            <text x="310" y="203" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">Deployment / Pod / Node state</text>
          </g>

          <g>
            <rect x="430" y="35" width="170" height="180"/>
            <text x="515" y="55" text-anchor="middle" font-size="10" font-weight="700" stroke="none">PromQL</text>
            <line x1="440" y1="65" x2="590" y2="65" opacity="0.4"/>
            <text x="440" y="85" font-size="9" font-family="var(--font-mono)" stroke="none" class="fig-muted">rate(http_requests_total</text>
            <text x="440" y="98" font-size="9" font-family="var(--font-mono)" stroke="none" class="fig-muted">  {status=~"5.."}[5m])</text>
            <text x="440" y="112" font-size="9" font-family="var(--font-mono)" stroke="none" class="fig-muted">/</text>
            <text x="440" y="125" font-size="9" font-family="var(--font-mono)" stroke="none" class="fig-muted">rate(http_requests_total[5m])</text>
            <line x1="440" y1="140" x2="590" y2="140" opacity="0.4"/>
            <text x="440" y="160" font-size="9" stroke="none" class="fig-em" font-weight="700">alert if &gt; 2% for 5m</text>
            <text x="440" y="176" font-size="9" stroke="none" class="fig-muted">→ Alertmanager</text>
            <text x="440" y="192" font-size="9" stroke="none" class="fig-muted">→ PagerDuty / Slack</text>
          </g>
        </svg>`,
        caption: 'Prometheus decides when to scrape, targets expose /metrics on a schedule. Missing scrapes are themselves a signal — `up == 0` alerts you when a target went dark. PromQL turns raw counters into rates, percentiles, SLO burn.',
      },
      intro: `<em>Metrics</em> are numbers over time — cheap to store at scale, ideal for alerting, indispensable for capacity and cost analysis. This chapter focuses on the metrics pillar and the reference implementation nearly everyone runs: <em>Prometheus</em>. Logs live in [[logs]]; traces live in [[traces]]; the dashboarding and alerting layer that ties them all together lives in [[grafana]].
Prometheus’s essential design choices are simple and durable: <em>pull-based</em> scraping of <code>/metrics</code> endpoints, a small set of metric types, labels as multi-dimensional keys, a functional query language (<em>PromQL</em>). Every managed offering — Grafana Mimir, Cortex, Thanos, VictoriaMetrics, GCP Managed Prometheus, AWS Managed Prometheus, Datadog’s Prom-compatible endpoint — respects that shape.`,
      concepts: [
        ['What Prometheus does', "Scrapes HTTP <code>/metrics</code> endpoints at a configured interval (15–30s typical), stores samples in a local time-series DB, exposes a query API (PromQL), and evaluates alert rules. Simple, single-binary, boringly reliable."],
        ['Pull vs push', "Prometheus <em>pulls</em>: it decides when to scrape, so it always knows if a target is healthy (a missed scrape is itself a signal — <code>up == 0</code>). Push-based tools (StatsD, OTLP) require the target to know where to send data. <em>Pushgateway</em> handles the exception: short-lived batch jobs that die before a scrape can find them."],
        ['Metric types', "<em>Counter</em>: monotonically increasing (requests_total, errors_total) — use <code>rate()</code> in queries. <em>Gauge</em>: goes up and down (memory bytes, queue depth). <em>Histogram</em>: pre-bucketed samples for percentiles (latency, request_size); query with <code>histogram_quantile()</code>. <em>Summary</em>: client-side percentiles — usually avoid in favour of histograms."],
        ['Labels & multi-dimensionality', "Every metric can carry key-value labels: <code>http_requests_total{method=\"POST\",status=\"200\",service=\"api\"}</code>. Slice and aggregate by any subset in PromQL. Labels are Prometheus’s superpower — and its footgun, if you pick them poorly."],
        ['Cardinality — the footgun', "Every unique label combination is a separate time series. High-cardinality labels (user_id, request_id, full URL paths) explode into millions of series and melt Prometheus. Rule: labels are for <em>classifying</em> (service, env, method, status); IDs and free-text belong in logs ([[logs]]) or traces ([[traces]])."],
        ['PromQL — the essentials', "<code>rate(http_requests_total[5m])</code> — per-second rate over 5m. <code>sum by (service) (rate(...))</code> — total per service. <code>histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))</code> — P99 latency per service. Learn <code>rate</code>, <code>sum by</code>, <code>histogram_quantile</code>, <code>increase</code>, and you’re 80% there."],
        ['Instrumentation', "How apps expose metrics. Language client libraries (<code>prometheus_client</code> for Python, <code>client_golang</code> for Go, official ones for Java/Ruby/JS...). Or emit OTel metrics ([[traces]]) and let the OTel Collector translate to Prometheus format. Auto-instrumentation of common libraries (HTTP, DB) covers a lot for free."],
        ['Exporters', "For things you don’t control the source of. <em>node_exporter</em>: host CPU/memory/disk/net. <em>kube-state-metrics</em>: K8s object state. <em>blackbox_exporter</em>: probe HTTP/DNS/TCP endpoints. <em>postgres_exporter</em>, <em>mysqld_exporter</em>, <em>redis_exporter</em>, <em>nginx_exporter</em>. Whatever it is, someone wrote an exporter."],
        ['Recording rules', "Pre-compute expensive PromQL and store the result as a new metric. <code>service:http_requests:rate5m = sum by (service) (rate(http_requests_total[5m]))</code>. Dashboards and alerts then query the cheap recorded series. Essential above a certain scale."],
        ['SLI, SLO, SLA', "<em>SLI</em>: the measurement — “% of requests under 200ms.” <em>SLO</em>: the internal target — “99.9% of SLI over 30 days.” <em>SLA</em>: the external contract with penalties. <em>Error budget</em>: 100% − SLO, the allowance you have to spend on risky changes. Alert on <em>burn rate</em>, not raw thresholds."],
        ['Golden signals & RED/USE', "Google SRE’s four: <em>traffic</em>, <em>errors</em>, <em>latency</em>, <em>saturation</em>. <em>RED</em> (Rate, Errors, Duration) — request-oriented view of a service. <em>USE</em> (Utilisation, Saturation, Errors) — resource-oriented view of a machine. Build these before anything else."],
        ['Alerting philosophy', "Alert on <em>symptoms</em> users care about (SLO burn, error rate, saturation), not <em>causes</em> (CPU %, disk usage). Every alert must be actionable, non-flappy, have a runbook, and route to the right team. Alerts without runbooks train responders to ignore them."],
        ['Alertmanager', "Prometheus’s companion for alert routing. Groups related alerts, deduplicates, silences during maintenance, routes to PagerDuty/Opsgenie/Slack/email based on labels. <em>Inhibition</em>: don’t page for “app down” when the underlying node is already alerting. Grafana Alerting ([[grafana]]) is an alternative that spans multiple data sources."],
        ['Remote_write, federation, long-term storage', "Prometheus’s local storage is deliberately short-term (typically 15 days). For long retention, <em>remote_write</em> streams samples to a scalable backend: Grafana Mimir, Cortex, Thanos, VictoriaMetrics, Datadog, or a cloud managed Prom. Federation lets one Prometheus scrape summary series from another — legacy, use remote_write for new setups."],
      ],
      code: `<span class="c"># Example PromQL — the classic four "golden signals"</span>

<span class="c"># Traffic — requests per second</span>
sum(<span class="k">rate</span>(http_requests_total[<span class="n">5m</span>])) <span class="k">by</span> (service)

<span class="c"># Errors — % of 5xx responses</span>
sum(<span class="k">rate</span>(http_requests_total{status=~<span class="s">"5.."</span>}[<span class="n">5m</span>])) <span class="k">by</span> (service)
/ sum(<span class="k">rate</span>(http_requests_total[<span class="n">5m</span>])) <span class="k">by</span> (service)

<span class="c"># Latency — 99th percentile</span>
<span class="k">histogram_quantile</span>(<span class="n">0.99</span>,
  sum(<span class="k">rate</span>(http_request_duration_seconds_bucket[<span class="n">5m</span>])) <span class="k">by</span> (le, service))

<span class="c"># Saturation — memory in use vs limit</span>
container_memory_working_set_bytes / container_spec_memory_limit_bytes`,
      codeCap: 'Google\'s four golden signals: traffic, errors, latency, saturation. If you only build four alerts, build these.',
      quiz: [
        {
          q: 'What are the "three pillars of observability"?',
          options: [
            'Alerts, dashboards, reports',
            'Metrics, logs, and traces',
            'CPU, memory, and disk',
            'Frontend, backend, and database',
          ],
          correct: 1,
          why: 'Each answers different questions; together they cover the "what, when, why" of production behaviour.',
        },
        {
          q: 'What query language does Prometheus use?',
          options: [
            'SQL',
            'PromQL — a functional query language over time series',
            'LogQL',
            'GraphQL',
          ],
          correct: 1,
          why: 'PromQL is the reason `rate()`, `sum() by (...)`, and `histogram_quantile()` are burned into every SRE\'s memory.',
        },
        {
          q: 'What is the difference between an SLI and an SLO?',
          options: [
            'They are the same thing',
            'SLI is the measurement (e.g. "% of requests under 200 ms"); SLO is the internal target for that measurement (e.g. "99.9% over 30 days")',
            'SLI is for internal use, SLO for external customers',
            'SLI is a tool; SLO is a metric type',
          ],
          correct: 1,
          why: 'SLA adds a third layer — the contractual promise, usually with penalties for missing it.',
        },
        {
          q: 'Prometheus is "pull-based" — what does that mean in practice?',
          options: [
            'It pulls data from a central database',
            'Prometheus scrapes /metrics endpoints on configured targets at an interval, rather than targets pushing to it',
            'It fetches data only on user demand',
            'It uses git pull under the hood',
          ],
          correct: 1,
          why: 'That\'s why every app you monitor exposes /metrics — Prometheus is coming to collect it.',
        },
        {
          q: 'What\'s the essential purpose of a distributed trace?',
          options: [
            'To log every function call in the codebase',
            'To follow a single request across multiple services, revealing latency and errors span by span',
            'To back up metric data',
            'To capture raw network packets',
          ],
          correct: 1,
          why: 'Traces are how you diagnose "a slow request" in a system where one request touches ten services.',
        },
      ],
    },

    {
      id: 'linux',
      part: 0,
      num: '03',
      title: 'Linux Systems',
      tag: 'The primitives under every container, VM, and cloud instance — systemd, journalctl, permissions, signals, sockets, SSH.',
      figure: {
        tag: 'Figure 1 · systemd, journal, and the operator\'s reflex',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <rect x="20" y="20" width="200" height="52"/>
          <text x="120" y="42" text-anchor="middle" font-size="12" font-weight="700" stroke="none">systemd unit</text>
          <text x="120" y="60" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">nginx.service · active</text>

          <path d="M 220 46 L 258 46" stroke="currentColor"/><polygon points="258,46 253,43 253,49" fill="currentColor"/>
          <rect x="260" y="20" width="180" height="52"/>
          <text x="350" y="42" text-anchor="middle" font-size="12" font-weight="700" stroke="none">journald</text>
          <text x="350" y="60" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">structured log stream</text>

          <path d="M 440 46 L 478 46" stroke="currentColor"/><polygon points="478,46 473,43 473,49" fill="currentColor"/>
          <rect x="480" y="20" width="120" height="52" stroke="var(--accent)"/>
          <text x="540" y="42" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">journalctl</text>
          <text x="540" y="60" text-anchor="middle" font-size="10" stroke="none" class="fig-em">-u nginx -f</text>

          <text x="20" y="120" font-size="11" font-weight="700" stroke="none">The four-command reflex</text>
          <g>
            <rect x="20" y="140" width="140" height="90"/>
            <text x="90" y="160" text-anchor="middle" font-size="11" font-weight="700" stroke="none">systemctl</text>
            <text x="90" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">is it up?</text>
            <text x="90" y="196" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">status | restart</text>

            <rect x="170" y="140" width="140" height="90"/>
            <text x="240" y="160" text-anchor="middle" font-size="11" font-weight="700" stroke="none">journalctl</text>
            <text x="240" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">what did it say?</text>
            <text x="240" y="196" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">-u name -f</text>

            <rect x="320" y="140" width="140" height="90"/>
            <text x="390" y="160" text-anchor="middle" font-size="11" font-weight="700" stroke="none">ss -tulpn</text>
            <text x="390" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">what listens?</text>
            <text x="390" y="196" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">| grep :port</text>

            <rect x="470" y="140" width="130" height="90"/>
            <text x="535" y="160" text-anchor="middle" font-size="11" font-weight="700" stroke="none">ps / top</text>
            <text x="535" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">what runs?</text>
            <text x="535" y="196" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">cpu · mem · time</text>
          </g>
        </svg>`,
        caption: 'systemctl → journalctl → ss → ps. Every unit writes to the journal; journalctl -u <name> -f is how you catch it in the act; ss shows sockets and their owning process; ps confirms what that process is doing. Four commands that solve most production Linux mysteries.',
      },
      intro: "Every server-side engineer needs a working knowledge of Linux — not to become a sysadmin, but because when a container misbehaves, when a service won’t start, when memory is disappearing, the answer is on the host. Containers are just Linux processes; a Kubernetes pod is a group of Linux processes; a cloud instance is Linux with a network attached.\nThe skills below are the ones you’ll actually use in production debugging: systemd for services, journalctl for logs, ss/ip for networking, ps/top for processes, permissions & sudo for access, signals for lifecycle, and SSH for reaching the host in the first place.",
      concepts: [
        ['systemd', "The init system on nearly every modern distro. Manages <em>units</em> (services, timers, sockets, mounts, targets). <code>systemctl start | stop | restart | reload | status | enable | disable &lt;unit&gt;</code>. Enable = start on boot; start = start now. <code>daemon-reload</code> after editing a unit file."],
        ['Unit files & drop-ins', "A unit file lives in <code>/etc/systemd/system/</code> (or is shipped in <code>/usr/lib/systemd/system/</code>). Override specific settings without editing the vendor file via drop-ins: <code>systemctl edit myapp.service</code> creates <code>/etc/systemd/system/myapp.service.d/override.conf</code>."],
        ['journalctl', "systemd’s log reader. <code>journalctl -u nginx -f</code> tails one unit; <code>-p err --since \"1 hour ago\"</code> filters by priority and window; <code>-o cat</code> strips headers; <code>-b</code> shows only current boot. Persistent journal: set <code>Storage=persistent</code> in <code>/etc/systemd/journald.conf</code>."],
        ['systemd timers vs cron', "<em>Timer units</em> (<code>myapp.timer</code> paired with <code>myapp.service</code>) are the modern replacement for cron. Advantages: logged in the journal, missed runs are catchable, dependencies, calendar syntax. <code>systemctl list-timers</code>."],
        ['Permissions (rwx)', "Every file has an owner, group, and mode. <code>chmod 644 file</code> = owner rw-, group r--, other r-- (read=4, write=2, exec=1, added per role). Directories need <code>x</code> to be traversable. <code>chown user:group file</code>. <code>umask</code> sets the default mask for new files."],
        ['Users, groups, sudo', "Users in <code>/etc/passwd</code>, groups in <code>/etc/group</code>, hashed passwords in <code>/etc/shadow</code>. <code>sudo</code> executes commands as another user (usually root) via <code>/etc/sudoers</code> rules. Prefer group membership + <code>%group ALL=NOPASSWD:...</code> over broad root grants."],
        ['Processes & signals', "<code>ps auxf</code> for a tree view, <code>top</code>/<code>htop</code>/<code>btop</code> for interactive. Signals: <em>SIGTERM</em> (15, polite shutdown, catchable) → <em>SIGINT</em> (2, Ctrl-C) → <em>SIGHUP</em> (1, historically reload config) → <em>SIGKILL</em> (9, uncatchable, immediate). <code>kill</code> = SIGTERM; <code>kill -9</code> = SIGKILL. Use SIGTERM first."],
        ['File descriptors, pipes, redirection', "Every process has three by default: 0 stdin, 1 stdout, 2 stderr. <code>cmd &gt; file</code> redirects stdout, <code>2&gt; err</code> redirects stderr, <code>&amp;&gt; both</code> redirects both. <code>|</code> pipes stdout to next command’s stdin. <code>2&gt;&amp;1</code> merges stderr into stdout."],
        ['Networking', "<code>ss -tulpn</code> shows listening TCP/UDP sockets with owning processes (the modern <code>netstat</code>). <code>ip a</code> for interfaces + addresses, <code>ip r</code> for routes. <code>curl -v</code> for HTTP debugging. <code>dig</code> for DNS. Firewalls: <code>iptables</code> (legacy) and <code>nftables</code> (modern replacement)."],
        ['SSH', "<code>~/.ssh/config</code> gives hosts short aliases and defaults. <code>ssh-keygen -t ed25519</code> creates a modern keypair. <code>ssh-copy-id</code> installs the public key on a remote. <code>ssh-agent</code> caches decrypted keys per session. Tunneling: <code>-L 3306:db.internal:3306</code> (local port forward), <code>-D 1080</code> (SOCKS)."],
        ['Filesystems & mounts', "Linux presents every storage device — disks, USB, network shares, tmpfs (RAM-backed), procfs, sysfs — as a filesystem attached somewhere in one unified directory tree. <code>mount /dev/sdb1 /data</code> attaches a disk; <code>umount /data</code> detaches. <code>mount</code> alone lists what's currently attached. <code>/etc/fstab</code> makes mounts persist across reboots (columns: device, mount point, fs type, options, dump, pass). Health checks: <code>df -h</code> for free space, <code>df -i</code> for inode usage, <code>du -sh *</code> for disk use per directory, <code>ncdu</code> for interactive exploration. Full disk is the #1 outage cause the tools above prevent."],
        ['Links — symbolic & hard', "Two flavours of 'this file is also called that.' <em>Symbolic link</em> (<code>ln -s target link</code>): a small file containing a path, resolved at access time. Ubiquitous — nginx <code>sites-enabled/</code> pointing into <code>sites-available/</code>, <code>update-alternatives</code> swapping default binaries, <code>/proc/self/exe</code> pointing at the current process. Breaks silently if the target moves. <em>Hard link</em> (<code>ln target link</code>): a second directory entry sharing the same <em>inode</em> — one file, two names of equal standing. Cannot cross filesystems, cannot link directories. Delete one, the other keeps working. <code>ls -l</code> shows a symlink's target; <code>ls -i</code> shows inode numbers so you can spot hard-linked files."],
        ['Package managers', "<code>apt</code> (Debian/Ubuntu), <code>dnf</code>/<code>yum</code> (RHEL/Fedora/Amazon), <code>apk</code> (Alpine), <code>pacman</code> (Arch). See [[packages]] for the language-level ecosystems that sit on top."],
      ],
      code: "<span class=\"c\"># A day in the life of Linux debugging</span>\n\n<span class=\"c\"># Is the service up? What did it just log?</span>\n$ systemctl status nginx\n<span class=\"n\">●</span> nginx.service - A high performance web server\n     Active: <span class=\"s\">active (running)</span> since Mon 2026-03-04 09:12:33 UTC; 3h ago\n\n$ journalctl -u nginx --since <span class=\"s\">\"10 min ago\"</span> -p err\n\n<span class=\"c\"># What is listening on port 8080? Which process?</span>\n$ ss -tulpn | grep :8080\ntcp LISTEN 0 128 *:8080 *:* users:((<span class=\"s\">\"go-app\"</span>,pid=4211,fd=6))\n\n<span class=\"c\"># Who owns that process and how much is it using?</span>\n$ ps -p 4211 -o pid,ppid,user,cmd,%cpu,%mem,etime\n\n<span class=\"c\"># A graceful shutdown, escalated if unresponsive</span>\n$ kill 4211                  <span class=\"c\"># SIGTERM (asks nicely)</span>\n$ sleep 5 &amp;&amp; kill -9 4211    <span class=\"c\"># SIGKILL (last resort)</span>\n\n<span class=\"c\"># Disk full? Find the culprit</span>\n$ df -h\n$ sudo du -sh /var/log/* | sort -h | tail -5\n\n<span class=\"c\"># Reload systemd after editing a unit file</span>\n$ sudo systemctl daemon-reload &amp;&amp; sudo systemctl restart myapp\n\n<span class=\"c\"># SSH with tunneling: reach a private DB through a bastion</span>\n$ ssh -L 5432:db.internal:5432 bastion.example.com",
      codeCap: 'systemctl → journalctl → ss → ps → df is the 90% of production Linux triage. Add SSH tunneling and you can reach anything.',
      quiz: [
        {
          q: 'What is systemd?',
          options: ['A text editor', 'The init system on modern Linux — manages services, timers, and system state', 'A shell', 'A container runtime'],
          correct: 1,
          why: 'It replaced the old sysvinit/upstart era. Every service is a unit file.',
        },
        {
          q: 'What does <code>journalctl -u nginx -f</code> do?',
          options: ['Restarts nginx and shows its logs', "Follows (tails) the systemd journal filtered to nginx’s unit", 'Deletes nginx logs', 'Shows nginx uptime only'],
          correct: 1,
          why: '<code>-u</code> filters by unit, <code>-f</code> is follow. Add <code>-n 200</code> for the last 200 lines first.',
        },
        {
          q: 'In <code>chmod 644 file</code>, what does 644 mean?',
          options: ["The file’s inode number", 'Owner rw-, group r--, other r-- (numeric permission mode)', 'Six users can read, four can write, four can execute', "The file’s ID"],
          correct: 1,
          why: 'Add the bits: read=4, write=2, exec=1. So 6=rw, 4=r-only.',
        },
        {
          q: 'What is the difference between SIGTERM and SIGKILL?',
          options: ['They are the same', 'SIGTERM politely asks a process to shut down (catchable, cleanup possible); SIGKILL kills immediately, uncatchable', 'SIGTERM is for containers only', 'SIGKILL is deprecated'],
          correct: 1,
          why: 'Always prefer SIGTERM first; reach for -9 only when a process is genuinely stuck.',
        },
        {
          q: 'Which command lists listening sockets with the owning process names?',
          options: ['<code>netcat -l</code>', '<code>ss -tulpn</code> (or the older <code>netstat -tulpn</code>)', '<code>ls /proc</code>', '<code>top --sockets</code>'],
          correct: 1,
          why: 'ss is the modern replacement for netstat and comes preinstalled on most distros.',
        },
      ],
    },

    {
      id: 'packages',
      part: 0,
      num: '04',
      title: 'Package & Dependency Management',
      tag: 'Every language, every OS: declare, lock, install reproducibly, keep the tree small. Learn the pattern once.',
      figure: {
        tag: 'Figure 1 · Manifest, lockfile, and the reproducible install',
        svg: `<svg class="figure-svg" viewBox="0 0 620 240" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="60" width="160" height="120"/>
            <text x="100" y="80" text-anchor="middle" font-size="11" font-weight="700" stroke="none">package.json</text>
            <text x="100" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">human-authored</text>
            <text x="35" y="122" font-size="9" stroke="none" class="fig-muted">express: ^4.19</text>
            <text x="35" y="138" font-size="9" stroke="none" class="fig-muted">react:   ^18.3</text>
            <text x="35" y="154" font-size="9" stroke="none" class="fig-muted">pg:      ~8.11</text>
            <text x="35" y="170" font-size="9" stroke="none" class="fig-muted">…</text>
          </g>
          <path d="M 180 120 L 218 120" stroke="currentColor"/><polygon points="218,120 213,117 213,123" fill="currentColor"/>
          <text x="199" y="112" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">resolve</text>
          <g>
            <rect x="220" y="60" width="180" height="120" stroke="var(--accent)"/>
            <text x="310" y="80" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">package-lock.json</text>
            <text x="310" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-em">exact tree · hashes</text>
            <text x="235" y="122" font-size="9" stroke="none" class="fig-muted">express@4.19.2  sha…</text>
            <text x="235" y="138" font-size="9" stroke="none" class="fig-muted">react@18.3.1    sha…</text>
            <text x="235" y="154" font-size="9" stroke="none" class="fig-muted">pg@8.11.5       sha…</text>
            <text x="235" y="170" font-size="9" stroke="none" class="fig-muted">+ 583 transitive</text>
          </g>
          <path d="M 400 120 L 438 120" stroke="currentColor"/><polygon points="438,120 433,117 433,123" fill="currentColor"/>
          <g>
            <rect x="440" y="60" width="160" height="120"/>
            <text x="520" y="82" text-anchor="middle" font-size="11" font-weight="700" stroke="none">node_modules/</text>
            <text x="520" y="100" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">materialised tree</text>
            <text x="520" y="130" text-anchor="middle" font-size="10" stroke="none" class="fig-em" font-weight="700">npm ci</text>
            <text x="520" y="146" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">strict · fails on drift</text>
          </g>
          <text x="20" y="34" font-size="9" font-weight="700" stroke="none" class="fig-muted" letter-spacing="0.2em">DECLARE  →  LOCK  →  INSTALL</text>
        </svg>`,
        caption: 'Every ecosystem — npm, pip, Composer, Cargo, go.mod — walks the same three steps. Commit the lockfile; use the strict-install command in CI (npm ci, pip install --require-hashes, cargo build --locked). Reproducibility isn\'t a discipline; it\'s a flag you remember to pass.',
      },
      intro: "Nothing you write runs in isolation. Every language and every OS has a package ecosystem, and building software professionally is largely the art of managing what depends on what — pinning what shouldn’t drift, updating what should, and keeping the transitive tree from becoming a security liability.\nThe mechanics differ (npm for Node, pip/poetry/uv for Python, Composer for PHP, Cargo for Rust, apt/dnf/apk for OS packages) but the principles are identical: declare dependencies explicitly, lock exact resolved versions, install reproducibly in CI, and audit regularly.",
      concepts: [
        ['Manifest', "The human-authored file that <em>declares</em> what your project depends on and at what version ranges. <code>package.json</code>, <code>pyproject.toml</code>, <code>composer.json</code>, <code>Cargo.toml</code>, <code>go.mod</code>. Contains ranges, not exact versions."],
        ['Lockfile', "The machine-generated file that <em>pins</em> the exact resolved versions of every direct and transitive dependency, with integrity hashes. <code>package-lock.json</code>, <code>poetry.lock</code>, <code>composer.lock</code>, <code>Cargo.lock</code>, <code>go.sum</code>. Always commit it."],
        ['Semver (MAJOR.MINOR.PATCH)', "Major = breaking change; Minor = backward-compatible feature; Patch = bug fix. Ranges: <code>^1.2.3</code> (1.2.3 up to 2.0.0), <code>~1.2.3</code> (1.2.3 up to 1.3.0), <code>1.2.x</code>, <code>&gt;=1.2.3 &lt;2.0.0</code>. Pin exactly for libraries you own; use ranges for apps."],
        ['Reproducible installs', "<code>npm ci</code>, <code>pnpm install --frozen-lockfile</code>, <code>poetry install --sync</code>, <code>uv sync --frozen</code>, <code>composer install --no-dev</code>, <code>cargo build --locked</code>. In CI, always use the strict variant — installs strictly from the lockfile and fails if it disagrees with the manifest. No lockfile mutations."],
        ['Transitive dependencies', "Your direct deps have their own deps, and so on — that whole tree is transitive. <code>npm ls</code>, <code>pipdeptree</code>, <code>composer show --tree</code>. A single popular library can pull in hundreds of transitive packages."],
        ['Auditing & CVEs', "<code>npm audit</code>, <code>pip-audit</code>, <code>composer audit</code>, <code>cargo audit</code> check installed versions against known-CVE databases. Integrate into CI. GitHub Dependabot and Snyk automate the fix PRs."],
        ['Composer (PHP)', "The dependency manager for PHP. <code>composer.json</code> + <code>composer.lock</code>, PSR-4 autoloading (<code>vendor/autoload.php</code>), Packagist is the main registry. <code>composer install</code> uses the lockfile; <code>composer update</code> refreshes it. In prod: <code>composer install --no-dev --optimize-autoloader</code>."],
        ['pnpm / yarn / uv', 'Alternatives to the defaults that trade minor differences for real gains. <em>pnpm</em>: content-addressable node_modules, dramatic disk + install-time savings. <em>uv</em>: Rust-based Python installer/resolver, 10-100× faster than pip. <em>yarn</em>: pnpm’s predecessor, still widely used.'],
        ['Private registries', "Where internal libraries live so they never leak. Nexus, Artifactory, GitHub Packages, npm private packages, PyPI mirrors, GitLab Package Registry. Auth via a scoped token; configure in <code>.npmrc</code> / <code>~/.pip.conf</code> / <code>auth.json</code>."],
        ['OS package management', '<code>apt-get</code> (Debian/Ubuntu), <code>dnf</code> or <code>yum</code> (RHEL/Fedora/Amazon), <code>apk</code> (Alpine). Pin versions in Dockerfiles (<code>curl=7.88.*</code>); unpinned OS packages silently drift on rebuild.'],
        ['Dockerfile pinning', "Pin the <em>base image</em> by tag or digest (<code>python:3.12.4-slim</code> or <code>@sha256:...</code>), and pin package versions in <code>RUN apt-get install ...</code>. Floating tags like <code>python:3</code> quietly change what your image contains between builds."],
      ],
      code: "<span class=\"c\"># The reproducible-install pattern, three languages</span>\n\n<span class=\"c\"># Node (in CI)</span>\n$ npm ci\n$ npm audit --production\n\n<span class=\"c\"># Python with Poetry</span>\n$ poetry install --no-interaction --no-root --only main\n\n<span class=\"c\"># PHP with Composer</span>\n$ composer install --no-dev --optimize-autoloader --no-interaction\n\n<span class=\"c\"># In a Dockerfile: pin base and OS packages</span>\n<span class=\"k\">FROM</span> debian:12.5-slim\n<span class=\"k\">RUN</span> apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\\n      ca-certificates curl=7.88.* \\\n    &amp;&amp; rm -rf /var/lib/apt/lists/*",
      codeCap: '<code>ci</code>, <code>--sync</code>, <code>--no-dev</code> — every ecosystem has a strict-lockfile install flag. Learn it and use it in CI.',
      quiz: [
        {
          q: 'What is the point of a lockfile?',
          options: ['To prevent editing dependencies', 'To pin exact resolved versions so installs are reproducible across machines and time', 'To lock the repository during install', 'Only npm needs one'],
          correct: 1,
          why: 'Manifest = ranges. Lockfile = the exact tree that got resolved from those ranges. Commit both.',
        },
        {
          q: 'In semver 1.2.3, what does the MINOR (2) part signal?',
          options: ['Any change at all', 'Backward-compatible feature additions', 'Breaking changes', 'Documentation-only updates'],
          correct: 1,
          why: 'MAJOR=breaking, MINOR=new features, PATCH=fixes. Ranges like ^1.2.3 allow MINOR/PATCH but not MAJOR.',
        },
        {
          q: 'How does <code>npm ci</code> differ from <code>npm install</code>?',
          options: ['They are identical', '<code>npm ci</code> installs strictly from <code>package-lock.json</code> and fails if it is out of sync with <code>package.json</code>; it never mutates the lockfile', '<code>npm ci</code> skips the lockfile', '<code>npm ci</code> is deprecated'],
          correct: 1,
          why: 'Use it in CI; use plain install when you actually mean to add or upgrade something.',
        },
        {
          q: 'What is Composer?',
          options: ['A JavaScript bundler', 'The dependency manager for PHP, using composer.json and Packagist', 'A Docker frontend', 'A Python packaging tool'],
          correct: 1,
          why: 'If you touch a PHP codebase, you touch Composer.',
        },
        {
          q: 'Why pin base image tags in a Dockerfile?',
          options: ['To make builds slower', 'Because a floating tag like <code>python:3</code> drifts silently between builds and can change what your image contains overnight', 'Because the registry requires it', 'To make the Dockerfile look tidier'],
          correct: 1,
          why: 'Reproducible builds are worth the diligence of pinning.',
        },
      ],
    },

    {
      id: 'dns',
      part: 1,
      num: '05',
      title: 'DNS & Core Networking',
      tag: 'Names, ports, TCP, HTTP status codes, caching — the plumbing under every request.',
      figure: {
        tag: 'Figure 1 · The DNS resolver chain',
        svg: `<svg class="figure-svg" viewBox="0 0 620 200" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="70" width="100" height="60"/>
            <text x="70" y="94" text-anchor="middle" font-size="11" font-weight="700" stroke="none">client</text>
            <text x="70" y="112" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">your app</text>

            <rect x="150" y="70" width="100" height="60"/>
            <text x="200" y="94" text-anchor="middle" font-size="11" font-weight="700" stroke="none">recursive</text>
            <text x="200" y="112" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">1.1.1.1 · caches</text>

            <rect x="280" y="70" width="80" height="60"/>
            <text x="320" y="94" text-anchor="middle" font-size="11" font-weight="700" stroke="none">root</text>
            <text x="320" y="112" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">.</text>

            <rect x="390" y="70" width="80" height="60"/>
            <text x="430" y="94" text-anchor="middle" font-size="11" font-weight="700" stroke="none">TLD</text>
            <text x="430" y="112" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">.com</text>

            <rect x="500" y="70" width="100" height="60"/>
            <text x="550" y="94" text-anchor="middle" font-size="11" font-weight="700" stroke="none">authoritative</text>
            <text x="550" y="112" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">example.com</text>
          </g>
          <g fill="currentColor">
            <path d="M 120 100 L 148 100" stroke="currentColor"/><polygon points="148,100 143,97 143,103"/>
            <path d="M 250 100 L 278 100" stroke="currentColor"/><polygon points="278,100 273,97 273,103"/>
            <path d="M 360 100 L 388 100" stroke="currentColor"/><polygon points="388,100 383,97 383,103"/>
            <path d="M 470 100 L 498 100" stroke="currentColor"/><polygon points="498,100 493,97 493,103"/>
          </g>
          <g stroke="var(--accent)" fill="var(--accent)" stroke-dasharray="3 3">
            <path d="M 550 130 Q 300 190 70 130" fill="none"/>
            <text x="310" y="182" text-anchor="middle" font-size="10" stroke="none" font-weight="700">A record → 93.184.216.34</text>
          </g>
          <text x="70" y="42" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">dig example.com</text>
          <text x="200" y="42" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">cache hit? return.</text>
          <text x="320" y="42" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">who .com?</text>
          <text x="430" y="42" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">who example?</text>
          <text x="550" y="42" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">the answer</text>
        </svg>`,
        caption: 'A DNS lookup walks four servers (worst case) before you get an IP. Every step caches — that\'s why a change with a low TTL propagates fast, and why an expired-cache issue can seem geographically random.',
      },
      intro: "DNS turns human names into machine addresses; without it, you’d be typing <code>172.217.169.14</code> instead of google.com. Every request your service makes to another service begins with a DNS lookup, and <em>misunderstood DNS</em> is behind a startling percentage of production outages — a stale cache, a low TTL that wasn’t low enough before the cutover, a CNAME chain that broke behind a load balancer.\nBelow the name is the transport (TCP, UDP), above it are the ports and services those transports carry, and framing it all is HTTP with its methods and status codes.",
      concepts: [
        ['Record types', "<code>A</code> (name → IPv4), <code>AAAA</code> (name → IPv6), <code>CNAME</code> (name → another name; can’t be at zone apex in classic DNS), <code>MX</code> (mail servers, prioritised), <code>TXT</code> (arbitrary text; SPF, DKIM, DMARC, service verification), <code>SRV</code> (host + port + priority for a service), <code>NS</code> (which nameservers are authoritative for a zone), <code>PTR</code> (IP → name, reverse DNS)."],
        ['Zones & delegation', "A <em>zone</em> is a portion of the DNS namespace (e.g. <code>example.com</code>) managed by an authoritative server. Subzones are delegated via <code>NS</code> records (<code>eu.example.com</code> can be delegated to a different server)."],
        ['Authoritative vs recursive', "<em>Authoritative</em> servers own the answer for their zones (Route 53, Cloudflare DNS). <em>Recursive</em> resolvers (your ISP, 1.1.1.1, 8.8.8.8) walk the tree from root and cache the answer. Client → recursive → root → TLD → authoritative → back."],
        ['TTL', 'Time To Live, in seconds. How long a resolver may cache a record. Low TTL (60s): fast propagation, more queries. High TTL (24h): fewer queries, slower propagation. <strong>Lower TTL a day before a planned cutover</strong>, then raise it back after.'],
        ['dig, drill, host', "Diagnostic tools. <code>dig +short example.com</code>, <code>dig example.com MX</code>, <code>dig +trace example.com</code> (walk delegation from root), <code>dig @8.8.8.8 example.com</code> (query a specific resolver), <code>+short</code>, <code>+noall +answer</code>. On containers use <code>getent hosts</code> or <code>host</code>."],
        ['DNSSEC', "Cryptographic signing of DNS records — resolvers can verify that answers weren’t tampered with. Adoption is mixed but growing; if you own a domain, most registrars now offer a one-click enable."],
        ['Ports & well-known services', "HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25/587, IMAPS=993, Postgres=5432, MySQL=3306, Redis=6379, Kafka=9092. Ports below 1024 require privilege on Linux."],
        ['TCP vs UDP', "TCP: reliable, ordered, connection-oriented (three-way handshake). Slower to start but guarantees delivery. UDP: fire-and-forget, no ordering, no ack. HTTP/1 and HTTP/2 are TCP; HTTP/3 is QUIC over UDP. DNS is UDP with TCP fallback for large answers or zone transfers."],
        ['HTTP methods & status codes', "Methods: <code>GET</code> (read, safe, idempotent), <code>HEAD</code>, <code>POST</code> (create), <code>PUT</code> (upsert, idempotent), <code>PATCH</code> (partial), <code>DELETE</code> (idempotent), <code>OPTIONS</code> (CORS preflight). Codes to know cold: 200 OK, 201 Created, 204 No Content, 301/302, 304 Not Modified, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404, 409 Conflict, 429 Too Many Requests, 500, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout."],
        ['Search domains & /etc/resolv.conf', "The host’s DNS config. <code>nameserver</code> lines list resolvers; <code>search</code> appends domains to short names (<code>api</code> → <code>api.default.svc.cluster.local</code>). In containers/Kubernetes this is generated for you and matters a lot for service discovery."],
      ],
      code: "<span class=\"c\"># dig — the DNS troubleshooter’s Swiss army knife</span>\n$ dig +short example.com\n<span class=\"n\">93.184.216.34</span>\n\n$ dig example.com MX\n;; ANSWER SECTION:\nexample.com.  86400  IN  MX  10 mail.example.com.\n\n<span class=\"c\"># Follow the delegation chain from root down</span>\n$ dig +trace example.com\n\n<span class=\"c\"># What is my system actually resolving this to right now?</span>\n$ getent hosts api.internal\n10.0.4.12   api.internal\n\n<span class=\"c\"># What is listening on this box?</span>\n$ ss -tulpn | grep LISTEN",
      codeCap: 'Cache issues hide everywhere. dig +short answers “what does it say now?” without ceremony.',
      quiz: [
        {
          q: 'What is a DNS A record?',
          options: ['A password record', 'A mapping from a domain name to an IPv4 address', 'A mapping to another domain name', 'An email routing record'],
          correct: 1,
          why: 'A is the workhorse. AAAA is the IPv6 sibling.',
        },
        {
          q: 'What is the difference between A and AAAA records?',
          options: ['They are the same', 'A maps to IPv4; AAAA maps to IPv6', 'A is authenticated; AAAA is anonymous', 'AAAA is deprecated'],
          correct: 1,
          why: 'AAAA has four "A"s because IPv6 addresses are four times as many bits as IPv4.',
        },
        {
          q: 'What is the effect of a low DNS TTL?',
          options: ['Records propagate slowly', 'Records propagate quickly, at the cost of more resolver queries', 'Records are cached forever', 'Records fail to resolve'],
          correct: 1,
          why: 'Lower TTL a day or two before a planned cutover; raise it back afterwards.',
        },
        {
          q: 'What is a CNAME?',
          options: ['An IP-to-name mapping', 'An alias pointing one name at another name (never at an IP directly)', 'A certificate authority record', 'A cache-name identifier'],
          correct: 1,
          why: 'CNAMEs point to names, not IPs. That’s why you can’t CNAME an apex/root domain in classic DNS (though ALIAS/ANAME extensions exist).',
        },
        {
          q: 'What port does HTTPS use by default?',
          options: ['80', '443', '8080', '22'],
          correct: 1,
          why: 'HTTP=80, HTTPS=443. Memorise the top ten and life gets easier.',
        },
      ],
    },

    {
      id: 'nginx',
      part: 1,
      num: '06',
      title: 'Nginx & Reverse Proxies',
      tag: 'The front door of a production system — TLS, load balancing, caching, headers, rate-limiting, all before your app sees a byte.',
      figure: {
        tag: 'Figure 1 · Reverse proxy — one front, many backends',
        svg: `<svg class="figure-svg" viewBox="0 0 560 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="105" width="90" height="50"/>
            <text x="65" y="127" text-anchor="middle" font-size="11" font-weight="700" stroke="none">client</text>
            <text x="65" y="143" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">HTTPS</text>
          </g>
          <g stroke="var(--accent)" stroke-width="1.5">
            <rect x="180" y="70" width="160" height="120"/>
            <text x="260" y="94" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">nginx</text>
            <text x="260" y="114" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">TLS terminate</text>
            <text x="260" y="132" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">rate limit</text>
            <text x="260" y="150" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">cache</text>
            <text x="260" y="168" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">least_conn balance</text>
          </g>
          <g>
            <rect x="410" y="30" width="130" height="42"/>
            <text x="475" y="47" text-anchor="middle" font-size="10" font-weight="700" stroke="none">app-1 · :8080</text>
            <text x="475" y="62" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">plain HTTP inside</text>

            <rect x="410" y="110" width="130" height="42"/>
            <text x="475" y="127" text-anchor="middle" font-size="10" font-weight="700" stroke="none">app-2 · :8080</text>
            <text x="475" y="142" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">plain HTTP inside</text>

            <rect x="410" y="190" width="130" height="42"/>
            <text x="475" y="207" text-anchor="middle" font-size="10" font-weight="700" stroke="none">app-3 · :8080</text>
            <text x="475" y="222" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">plain HTTP inside</text>
          </g>
          <g fill="currentColor">
            <path d="M 110 130 L 178 130" stroke="currentColor"/><polygon points="178,130 173,127 173,133"/>
            <path d="M 340 100 L 408 51" stroke="currentColor"/><polygon points="408,51 400,52 403,58"/>
            <path d="M 340 130 L 408 131" stroke="currentColor"/><polygon points="408,131 403,128 403,134"/>
            <path d="M 340 160 L 408 211" stroke="currentColor"/><polygon points="408,211 403,206 400,211"/>
          </g>
          <text x="140" y="180" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">443/tcp</text>
        </svg>`,
        caption: 'The reverse proxy sits between the internet and your app. It terminates TLS once, load-balances, caches, and rate-limits — so the backends stay boring, plain-HTTP, cert-free processes doing the actual work.',
      },
      intro: "A reverse proxy sits in front of your servers and accepts traffic on their behalf — terminating TLS, load-balancing across replicas, caching responses, injecting/rewriting headers, rate-limiting abusive clients, dropping malformed requests. It is the piece of the stack a request from the internet talks to first, and the natural home for concerns you don’t want repeated in every backend.\nThe three you’ll actually meet: <em>nginx</em> — the default reverse proxy for over a decade, small, fast, endlessly configurable; <em>Caddy</em> — modern Go server whose killer feature is automatic HTTPS via Let’s Encrypt with essentially no config; <em>HAProxy</em> — the serious high-performance TCP/HTTP load balancer, still the choice for the biggest fleets. Cloud offerings (AWS ALB, GCP HTTPS LB, Cloudflare) do the same job as managed services.",
      concepts: [
        ['Reverse proxy vs forward proxy', "A <em>reverse</em> proxy represents the server to the client — client hits proxy, proxy forwards to backend. A <em>forward</em> proxy represents the client to the server — client hits proxy on the way <em>out</em>, proxy forwards to arbitrary destinations (corporate egress, Squid). Same idea, opposite direction."],
        ['Load-balancing algorithms', "<em>round-robin</em>: rotate through backends (default). <em>least_conn</em>: pick the one with the fewest active connections (good for varied request durations). <em>ip_hash</em>: hash the client IP so the same client sticks to the same backend (sticky sessions). <em>weighted</em>: give some backends more load (heterogeneous fleets or canary)."],
        ['TLS termination', "The proxy decrypts HTTPS once, at the edge, and speaks plain HTTP to internal backends. Removes cert management from every app. Modern setups also do <em>TLS re-encryption</em> to the backend (mTLS internal) — belt-and-braces for compliance."],
        ['Upstream block', "Nginx term for a named group of backends behind a <code>proxy_pass</code>. Define once, reference from many <code>server</code> blocks. <code>server 10.0.1.11:8080 max_fails=3 fail_timeout=30s;</code> — after 3 failures inside 30s, that backend is marked down."],
        ['proxy_pass & headers', "<code>proxy_pass http://api;</code> sends the request on. Always forward <code>Host</code>, <code>X-Real-IP</code>, <code>X-Forwarded-For</code>, <code>X-Forwarded-Proto</code> so the backend knows what the client actually asked for. Without <code>X-Forwarded-For</code>, every request looks like it came from the proxy."],
        ['Rate limiting', "<code>limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;</code> — a shared-memory zone tracking requests per client IP. Apply with <code>limit_req zone=api burst=20 nodelay;</code>. Cheap first line of defence against abuse."],
        ['Caching in nginx', "<code>proxy_cache_path /var/cache/nginx keys_zone=api:100m max_size=10g;</code> lets nginx cache backend responses on disk keyed by URL. Combine with <code>proxy_cache_valid 200 5m;</code> and honour <code>Cache-Control</code>. Cross-ref: [[caching]]."],
        ['Health checks', "Passive by default (<code>max_fails</code>/<code>fail_timeout</code>). <em>Active</em> health checks (an nginx worker actively probing <code>/healthz</code>) require Nginx Plus, or you configure them in the platform (K8s readiness probes, ALB target groups)."],
        ['Websockets & HTTP/2', "For WebSockets, set <code>proxy_http_version 1.1;</code> and forward <code>Upgrade</code>/<code>Connection</code> headers so the protocol switch survives. HTTP/2 works via <code>listen 443 ssl http2;</code>. HTTP/3 (QUIC) is now stable in nginx too."],
        ['Caddy — automatic HTTPS', "Point Caddy at a domain and it obtains, installs, and renews a Let’s Encrypt certificate on its own, using ACME. Configuration is a tiny <code>Caddyfile</code>. Perfect for single-server deployments where cert-manager would be overkill."],
        ['HAProxy — L4 & L7 LB', "The go-to for the biggest loads. Excellent stats page, sub-millisecond decisions, native health checks, ACLs, connection queuing. TCP mode as well as HTTP — put HAProxy in front of Postgres or Redis to load-balance TCP."],
      ],
      code: "<span class=\"c\"># nginx.conf — TLS termination, load balancing, rate limiting, caching</span>\n\n<span class=\"c\"># Shared-memory zones for rate limiting and caching</span>\n<span class=\"k\">limit_req_zone</span> <span class=\"n\">$binary_remote_addr</span> zone=api_rl:10m rate=10r/s;\n<span class=\"k\">proxy_cache_path</span> /var/cache/nginx keys_zone=api_cache:100m max_size=1g inactive=1h;\n\n<span class=\"k\">upstream</span> api {\n  <span class=\"k\">least_conn</span>;\n  <span class=\"k\">server</span> 10.0.1.11:8080 max_fails=3 fail_timeout=30s;\n  <span class=\"k\">server</span> 10.0.1.12:8080 max_fails=3 fail_timeout=30s;\n  <span class=\"k\">server</span> 10.0.1.13:8080 max_fails=3 fail_timeout=30s;\n  <span class=\"k\">keepalive</span> 32;\n}\n\n<span class=\"k\">server</span> {\n  <span class=\"k\">listen</span> 443 ssl http2;\n  <span class=\"k\">server_name</span> api.example.com;\n  <span class=\"k\">ssl_certificate</span>     /etc/ssl/api.crt;\n  <span class=\"k\">ssl_certificate_key</span> /etc/ssl/api.key;\n  <span class=\"k\">ssl_protocols</span> TLSv1.2 TLSv1.3;\n\n  <span class=\"c\"># Redirect plain HTTP to HTTPS is done in a separate server block on :80</span>\n\n  <span class=\"k\">location</span> /healthz { <span class=\"k\">return</span> 200 <span class=\"s\">\"ok\\n\"</span>; }\n\n  <span class=\"k\">location</span> /api/ {\n    <span class=\"k\">limit_req</span> zone=api_rl burst=20 nodelay;\n\n    <span class=\"k\">proxy_pass</span> http://api;\n    <span class=\"k\">proxy_http_version</span> 1.1;\n    <span class=\"k\">proxy_set_header</span> Host              <span class=\"n\">$host</span>;\n    <span class=\"k\">proxy_set_header</span> X-Real-IP         <span class=\"n\">$remote_addr</span>;\n    <span class=\"k\">proxy_set_header</span> X-Forwarded-For   <span class=\"n\">$proxy_add_x_forwarded_for</span>;\n    <span class=\"k\">proxy_set_header</span> X-Forwarded-Proto <span class=\"n\">$scheme</span>;\n    <span class=\"k\">proxy_set_header</span> Connection        <span class=\"s\">\"\"</span>;   <span class=\"c\"># enable upstream keepalive</span>\n\n    <span class=\"k\">proxy_cache</span>          api_cache;\n    <span class=\"k\">proxy_cache_valid</span>    200 302 5m;\n    <span class=\"k\">proxy_cache_bypass</span>   <span class=\"n\">$http_authorization</span>;\n\n    <span class=\"k\">proxy_read_timeout</span>   30s;\n  }\n}\n\n<span class=\"c\"># --- Caddy equivalent (in a Caddyfile) ---</span>\n<span class=\"c\"># api.example.com {</span>\n<span class=\"c\">#   reverse_proxy 10.0.1.11:8080 10.0.1.12:8080 10.0.1.13:8080 {</span>\n<span class=\"c\">#     lb_policy least_conn</span>\n<span class=\"c\">#     health_uri /healthz</span>\n<span class=\"c\">#   }</span>\n<span class=\"c\"># }   # HTTPS is automatic. That's the whole file.</span>",
      codeCap: 'TLS termination, load balancing, rate limiting, response caching, upstream keepalive — one file, one process. And Caddy would do the HTTPS part on its own.',
      code: "<span class=\"c\"># nginx.conf — TLS-terminating reverse proxy with load balancing</span>\n<span class=\"k\">upstream</span> api {\n  <span class=\"k\">least_conn</span>;\n  <span class=\"k\">server</span> 10.0.1.11:8080 max_fails=3 fail_timeout=30s;\n  <span class=\"k\">server</span> 10.0.1.12:8080 max_fails=3 fail_timeout=30s;\n  <span class=\"k\">server</span> 10.0.1.13:8080 max_fails=3 fail_timeout=30s;\n}\n\n<span class=\"k\">server</span> {\n  <span class=\"k\">listen</span> 443 ssl http2;\n  <span class=\"k\">server_name</span> api.example.com;\n  <span class=\"k\">ssl_certificate</span>     /etc/ssl/api.crt;\n  <span class=\"k\">ssl_certificate_key</span> /etc/ssl/api.key;\n\n  <span class=\"k\">location</span> / {\n    <span class=\"k\">proxy_pass</span> http://api;\n    <span class=\"k\">proxy_set_header</span> Host <span class=\"n\">$host</span>;\n    <span class=\"k\">proxy_set_header</span> X-Real-IP <span class=\"n\">$remote_addr</span>;\n    <span class=\"k\">proxy_set_header</span> X-Forwarded-For <span class=\"n\">$proxy_add_x_forwarded_for</span>;\n    <span class=\"k\">proxy_set_header</span> X-Forwarded-Proto <span class=\"n\">$scheme</span>;\n  }\n}",
      codeCap: 'Three upstreams, least-connections balancing, TLS terminated at the proxy. The app never sees a cert.',
      quiz: [
        {
          q: 'What is the difference between a reverse proxy and a forward proxy?',
          options: ['A forward proxy represents the client to the server; a reverse proxy represents the server to the client', 'They are the same thing', 'Reverse proxies are older technology', 'Forward proxies do not exist anymore'],
          correct: 0,
          why: 'Forward = corporate egress proxy hiding clients; reverse = nginx hiding servers.',
        },
        {
          q: 'What does “TLS termination” at a reverse proxy mean?',
          options: ['The proxy blocks all TLS connections', 'The proxy decrypts HTTPS once and speaks plain HTTP to internal backends — apps stop managing certs', 'The proxy re-encrypts traffic on every hop', 'TLS is not supported'],
          correct: 1,
          why: 'Centralising cert management is a primary reason to run a reverse proxy.',
        },
        {
          q: 'Why load-balance across multiple backends?',
          options: ['To make each request slower', 'To distribute load so no single backend melts, and to route around unhealthy ones', 'To prevent horizontal scaling', 'For legal compliance'],
          correct: 1,
          why: 'It also enables rolling deploys, canary routing, and graceful failover.',
        },
        {
          q: 'What is Caddy best known for?',
          options: ["Automatic HTTPS via Let’s Encrypt with essentially no configuration", 'Being the fastest reverse proxy', 'Running only on Windows', 'Refusing to support HTTP/2'],
          correct: 0,
          why: 'ACME + Let’s Encrypt is the default; great for small deployments.',
        },
        {
          q: 'What does the <code>X-Forwarded-For</code> header do?',
          options: ['Blocks forwarded traffic', 'Preserves the original client IP through a chain of proxies (comma-separated as it goes)', 'Encrypts the request payload', 'Redirects to another server'],
          correct: 1,
          why: "Without it your app sees only the proxy’s IP and can’t rate-limit or audit by client.",
        },
      ],
    },

    {
      id: 'tls',
      part: 1,
      num: '07',
      title: 'TLS, SSL & Certificates',
      tag: 'The handshake that makes HTTPS secure — certificates, chains, ACME, mTLS, and the rotation that keeps you out of the news.',
      figure: {
        tag: 'Figure 1 · The TLS 1.3 handshake',
        svg: `<svg class="figure-svg" viewBox="0 0 560 290" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="20" width="140" height="42"/>
            <text x="90" y="42" text-anchor="middle" font-size="12" font-weight="700" stroke="none">client</text>
            <text x="90" y="56" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">browser / curl / sdk</text>

            <rect x="400" y="20" width="140" height="42"/>
            <text x="470" y="42" text-anchor="middle" font-size="12" font-weight="700" stroke="none">server</text>
            <text x="470" y="56" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">holds private key + cert</text>

            <line x1="90" y1="62" x2="90" y2="260" stroke-dasharray="2 3" opacity="0.4"/>
            <line x1="470" y1="62" x2="470" y2="260" stroke-dasharray="2 3" opacity="0.4"/>
          </g>
          <g fill="currentColor" stroke="currentColor">
            <path d="M 100 90 L 458 90"/><polygon points="458,90 452,87 452,93"/>
            <text x="280" y="82" text-anchor="middle" font-size="10" stroke="none">ClientHello · SNI · cipher suites · random_c · key_share</text>

            <path d="M 460 130 L 102 130"/><polygon points="102,130 108,127 108,133"/>
            <text x="280" y="122" text-anchor="middle" font-size="10" stroke="none">ServerHello · chosen cipher · random_s · key_share · {cert, ...}</text>

            <line x1="90" y1="160" x2="470" y2="160" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4 3"/>
            <text x="280" y="153" text-anchor="middle" font-size="10" stroke="none" fill="var(--accent)" font-weight="700">both derive session key from randoms + key_shares</text>

            <path d="M 100 195 L 458 195"/><polygon points="458,195 452,192 452,198"/>
            <text x="280" y="188" text-anchor="middle" font-size="10" stroke="none">Finished · verify_data (MAC of transcript)</text>

            <line x1="90" y1="230" x2="470" y2="230" stroke="var(--accent)" stroke-width="2"/>
            <text x="280" y="222" text-anchor="middle" font-size="11" stroke="none" fill="var(--accent)" font-weight="700">encrypted application data</text>
          </g>
          <text x="20" y="278" font-size="9" stroke="none" class="fig-muted">1 RTT total (TLS 1.3). TLS 1.2 was 2 RTT.</text>
        </svg>`,
        caption: 'The TLS 1.3 handshake in one round-trip: client proposes ciphers and its share of the ephemeral key, server picks one and sends back its share plus the cert, both sides derive the same session key from the exchange, and the encrypted tunnel is open.',
      },
      intro: "TLS is what makes HTTPS actually secure — a handshake at the start of a TCP connection that establishes an encrypted, authenticated channel between client and server. SSL is TLS’s predecessor; the names are used interchangeably out of habit, though every current implementation is TLS (1.2 or 1.3 — everything older is deprecated).\nThe core object is the certificate: a public key bound to an identity (a domain name, or a machine identity, or a person), signed by a certificate authority (CA) the client already trusts. Learn to read a certificate, understand the chain, and automate renewal — and you’ll close the door on a whole class of production embarrassments.",
      concepts: [
        ['Symmetric vs asymmetric crypto', "TLS uses both. <em>Asymmetric</em> (RSA, ECDSA, Ed25519) — different keys for encrypt and decrypt; used in the handshake to establish trust and exchange a session key. <em>Symmetric</em> (AES-GCM, ChaCha20-Poly1305) — same key for encrypt/decrypt; fast, used for the bulk of the traffic once the session key is set."],
        ['Certificate (X.509)', "A public key plus metadata (subject, issuer, validity dates, Subject Alternative Names, key usage) signed by a CA. The <em>private key</em> stays on your server, never shared; the certificate (containing the public key) is public and served to any client."],
        ['Certificate chain', "Server cert → intermediate CA → root CA. You serve the server certificate plus any intermediates (order matters); the client already has the root in its trust store. <code>openssl s_client -showcerts</code> reveals the chain the server actually presents. Missing intermediate = mysterious “handshake failed” on some clients."],
        ['CA & trust stores', "A CA is any entity whose root cert is pre-installed in browsers/OSes (DigiCert, Sectigo, Let’s Encrypt, Amazon Trust Services). Trust stores are per-platform: browser store, OS store, JVM cacerts, the Go runtime\\'s built-in list. Internal PKI issues certs from a private CA that only your systems trust."],
        ['ACME & Let’s Encrypt', "Let’s Encrypt is a free automated CA. Its <em>ACME</em> protocol lets clients (certbot, cert-manager, Caddy, nginx-acme, Traefik) prove control of a domain (HTTP-01 or DNS-01 challenge), obtain a 90-day cert, and renew automatically. Short lifetimes force automation, which is the whole point."],
        ['SNI', "Server Name Indication. A TLS extension that lets the client tell the server which hostname it wants <em>during</em> the handshake. Without SNI, one IP could only host one certificate; with it, you serve hundreds of domains from a single IP:port. Modern TLS (Encrypted Client Hello) is closing the metadata leak."],
        ['TLS 1.2 vs TLS 1.3', "1.3 is the current version — cleaner handshake (1 round-trip, or 0-RTT for resumption), fewer weak ciphers, forward secrecy required, encrypted certificates. Support both for compatibility (<code>ssl_protocols TLSv1.2 TLSv1.3;</code>); disable everything older explicitly."],
        ['Cipher suites & forward secrecy', "A cipher suite is the combination of key-exchange (ECDHE), authentication (RSA/ECDSA), symmetric cipher (AES-GCM/ChaCha20), and hash (SHA-256/384) used for a session. <em>Forward secrecy</em> (ECDHE) means a compromised private key later can’t decrypt past sessions. Non-negotiable in 2026."],
        ['mTLS (mutual TLS)', "Both sides present certificates — the server authenticates to the client (normal), and the client also authenticates to the server. Standard inside service meshes ([[service-mesh]]), for machine-to-machine APIs, for VPN gateways. Client identity is baked into the cert, not passed as an HTTP header."],
        ['Rotation & automation', "Certificates expire — Let’s Encrypt every 90 days, commercial certs every year, internal PKI often every few months. Automate renewal: <em>cert-manager</em> on Kubernetes, <em>certbot</em> on VMs, <em>Caddy</em> or <em>nginx-acme</em> as first-class features. A prod outage from an expired cert is a preventable page."],
        ['Diagnosing TLS problems', "<code>openssl s_client -connect host:443 -servername host</code> shows the cert, chain, protocol, and cipher. <code>curl -vI https://host</code> shows what a real client sees. <code>ssllabs.com/ssltest</code> grades your config publicly. Common failures: wrong SAN, expired cert, missing intermediate, weak cipher, protocol mismatch."],
      ],
      code: "<span class=\"c\"># Inspect what a server actually presents</span>\n$ openssl s_client -connect example.com:443 -servername example.com &lt; /dev/null 2&gt;/dev/null \\\n    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName\n\nsubject = CN = example.com\nissuer  = CN = R11, O = Let's Encrypt, C = US\nnotBefore = Jul 12 2026 GMT\nnotAfter  = Oct 10 2026 GMT\nX509v3 Subject Alternative Name: DNS:example.com, DNS:www.example.com\n\n<span class=\"c\"># Which chain and cipher was actually negotiated?</span>\n$ curl -vI https://example.com 2&gt;&amp;1 | grep -E <span class=\"s\">'(SSL|TLS|cert|issuer)'</span>\n*  SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384\n*  Server certificate: subject: CN=example.com\n\n<span class=\"c\"># A cert-manager Certificate resource — automatic issuance + renewal in K8s</span>\n<span class=\"k\">apiVersion</span>: cert-manager.io/v1\n<span class=\"k\">kind</span>: Certificate\n<span class=\"k\">metadata</span>: { <span class=\"k\">name</span>: <span class=\"s\">api-tls</span>, <span class=\"k\">namespace</span>: <span class=\"s\">prod</span> }\n<span class=\"k\">spec</span>:\n  <span class=\"k\">secretName</span>: <span class=\"s\">api-tls</span>                     <span class=\"c\"># the K8s Secret cert-manager creates</span>\n  <span class=\"k\">issuerRef</span>: { <span class=\"k\">name</span>: <span class=\"s\">letsencrypt-prod</span>, <span class=\"k\">kind</span>: ClusterIssuer }\n  <span class=\"k\">dnsNames</span>: [<span class=\"s\">api.example.com</span>]\n  <span class=\"k\">duration</span>:    <span class=\"s\">2160h</span>       <span class=\"c\"># 90 days</span>\n  <span class=\"k\">renewBefore</span>: <span class=\"s\">720h</span>        <span class=\"c\"># renew when 30 days remain</span>\n\n<span class=\"c\"># Generate a keypair + CSR for a private CA (rarely done by hand)</span>\n$ openssl req -new -newkey rsa:2048 -nodes -keyout api.key -out api.csr \\\n    -subj <span class=\"s\">\"/CN=api.internal/O=Acme\"</span>",
      codeCap: 's_client to see what a server presents, curl -vI to see what a client negotiates, and cert-manager to make renewal never your problem.',
      code: "<span class=\"c\"># Inspect a certificate presented by a server</span>\n$ openssl s_client -connect example.com:443 -servername example.com &lt; /dev/null 2&gt;/dev/null \\\n    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName\n\nsubject=CN = example.com\nissuer=CN = DigiCert TLS RSA SHA256 2020 CA1\nnotBefore=Feb 13 00:00:00 2025 GMT\nnotAfter=Mar 14 23:59:59 2026 GMT\nX509v3 Subject Alternative Name: DNS:example.com, DNS:www.example.com\n\n<span class=\"c\"># Peek at a local certificate file</span>\n$ openssl x509 -in cert.pem -noout -text | head",
      codeCap: 'The Subject, the Issuer, the dates, the SANs. Four things to check when a TLS problem is on your desk.',
      quiz: [
        {
          q: 'What is a certificate authority (CA)?',
          options: ['A hardware device', 'A trusted party that signs certificates; its root certificate is pre-installed in browsers and operating systems', 'A type of encryption key', 'A backup of a certificate'],
          correct: 1,
          why: 'Trust in TLS ultimately traces back to a root CA the client already trusts.',
        },
        {
          q: 'What does mTLS add over standard TLS?',
          options: ['Nothing', 'The client also presents a certificate — mutual authentication in both directions', 'More encryption layers', 'It is a mesh protocol'],
          correct: 1,
          why: 'Common in service meshes (Istio, Linkerd) where every pod authenticates to every other.',
        },
        {
          q: 'Why should you automate certificate renewal?',
          options: ['Legal requirement', "Certificates expire (Let’s Encrypt certs last 90 days) and expiry = outage", 'Because CAs charge more otherwise', 'Only for load balancing'],
          correct: 1,
          why: 'cert-manager on Kubernetes and certbot on VMs are the standard answers.',
        },
        {
          q: 'What is SNI used for?',
          options: ['Session negotiation', 'Letting a client indicate which hostname it wants during the TLS handshake so one IP can serve many domains', 'Signing intermediates', 'Encrypting SNI itself'],
          correct: 1,
          why: 'Without SNI, a server couldn’t know which cert to present before decrypting.',
        },
        {
          q: 'What is the difference between SSL and TLS in practice?',
          options: ['They are different protocols still in active use', "TLS is SSL’s successor; the terms are used interchangeably out of habit but every modern deployment is TLS (1.2 or 1.3)", 'SSL is more secure than TLS', 'TLS is deprecated'],
          correct: 1,
          why: 'All SSL versions are deprecated. TLS 1.0 and 1.1 also. Aim for 1.2 minimum, 1.3 preferred.',
        },
      ],
    },

    {
      id: 'vpn',
      part: 1,
      num: '08',
      title: 'VPN, BGP & Cloud Networking',
      tag: 'Joining networks that shouldn’t naturally see each other — safely, cheaply, and at scale.',
      figure: {
        tag: 'Figure 1 · A VPC with public and private subnets',
        svg: `<svg class="figure-svg" viewBox="0 0 620 280" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <!-- VPC outer -->
          <rect x="20" y="20" width="580" height="240" stroke-dasharray="4 4"/>
          <text x="30" y="38" font-size="10" font-weight="700" stroke="none" class="fig-em">VPC 10.0.0.0/16</text>

          <!-- Internet Gateway -->
          <rect x="270" y="60" width="80" height="34"/>
          <text x="310" y="82" text-anchor="middle" font-size="10" font-weight="700" stroke="none">IGW</text>
          <path d="M 310 60 L 310 30" stroke="currentColor"/><polygon points="310,30 307,36 313,36" fill="currentColor"/>
          <text x="360" y="34" font-size="10" stroke="none" class="fig-muted">internet</text>

          <!-- Public subnet -->
          <rect x="50" y="120" width="240" height="110"/>
          <text x="60" y="138" font-size="10" font-weight="700" stroke="none">Public subnet · 10.0.1.0/24</text>
          <rect x="70" y="150" width="90" height="34"/>
          <text x="115" y="171" text-anchor="middle" font-size="10" stroke="none">Load Bal.</text>
          <rect x="170" y="150" width="90" height="34"/>
          <text x="215" y="171" text-anchor="middle" font-size="10" stroke="none">NAT gw</text>
          <text x="60" y="212" font-size="9" stroke="none" class="fig-muted">route: 0.0.0.0/0 → IGW</text>

          <!-- Private subnet -->
          <rect x="330" y="120" width="240" height="110"/>
          <text x="340" y="138" font-size="10" font-weight="700" stroke="none">Private subnet · 10.0.10.0/24</text>
          <rect x="350" y="150" width="90" height="34"/>
          <text x="395" y="171" text-anchor="middle" font-size="10" stroke="none">app</text>
          <rect x="450" y="150" width="100" height="34"/>
          <text x="500" y="171" text-anchor="middle" font-size="10" stroke="none">database</text>
          <text x="340" y="212" font-size="9" stroke="none" class="fig-muted">route: 0.0.0.0/0 → NAT (egress only)</text>

          <!-- Connections -->
          <g stroke="currentColor" fill="currentColor">
            <path d="M 260 167 L 348 167" stroke-dasharray="2 3" opacity="0.5"/>
            <path d="M 160 167 L 168 167" opacity="0.6"/>
          </g>
          <line x1="215" y1="150" x2="310" y2="94" stroke-dasharray="1 3" opacity="0.4"/>
          <line x1="115" y1="150" x2="310" y2="94" stroke-dasharray="1 3" opacity="0.4"/>
        </svg>`,
        caption: 'A production VPC in miniature. The load balancer lives in the public subnet and is reachable from the internet; the app and database live in the private subnet with no direct inbound reachability. Egress from private happens through the NAT gateway — the line that shows up on your cloud bill.',
      },
      intro: "Once your infrastructure spans more than one place — cloud + on-prem, two regions, a mix of accounts — you need networking that stitches them. VPNs give you encrypted tunnels between networks or from a laptop into a network. BGP is how the internet (and every big cloud’s backbone) exchanges routes. VPC design decides who can reach what.\nMost outages at scale end up here: a route missing, a peering broken, a security group too tight, a NAT gateway silently costing a fortune. This chapter covers the primitives — enough to be dangerous with your cloud architect and to read a diagram of the corporate WAN without panicking.",
      concepts: [
        ['VPN — site-to-site vs client', "<em>Site-to-site</em>: two entire networks joined by an encrypted tunnel — office ↔ cloud, VPC ↔ VPC in another provider, on-prem ↔ AWS via a Customer Gateway. <em>Client VPN</em>: one device joins one network (Cloudflare WARP, Tailscale, OpenVPN AS)."],
        ['WireGuard', "The modern default. Kernel-native on Linux, tiny codebase (~4k LoC, auditable), single UDP port, symmetric config file per peer — public keys and allowed-IP ranges. Fast, resilient to NAT, no session state. Tailscale and Netmaker are managed WireGuard networks with automatic mesh discovery."],
        ['OpenVPN & IPsec', "The older mainstays. <em>OpenVPN</em>: TLS-based, feature-rich, still the corporate standard for client VPN. <em>IPsec</em>: standardised VPN suite, native in every OS and every firewall — pain to configure by hand but ubiquitous, especially for cloud-to-on-prem site tunnels."],
        ['BGP — what it actually does', "Border Gateway Protocol. Autonomous Systems (ASes) advertise which IP prefixes they can reach to their neighbours. A router chooses the best path from the advertisements it receives. This is how the entire public internet routes, and how cloud transit hubs work internally. A misconfigured BGP announcement can black-hole a country (has, more than once)."],
        ['BGP inside the cloud', "Cloud transit gateways speak BGP. When you connect on-prem to AWS via Direct Connect (or GCP Cloud Interconnect / Azure ExpressRoute), you exchange routes via BGP. Same when linking clouds with SD-WAN vendors (Aviatrix, Megaport). You don’t configure routing tables by hand; you learn them."],
        ['VPC / VNet & CIDR planning', "An isolated network in your cloud account. Choose a CIDR block (<code>10.0.0.0/16</code> = 65k IPs) large enough to slice into subnets across AZs. <em>Never overlap</em> CIDRs of networks you might one day peer — de-conflicting later is expensive."],
        ['Subnets: public, private, isolated', "<em>Public</em>: has a route to an Internet Gateway; assigns public IPs; put load balancers here. <em>Private</em>: no direct internet reachability; databases, workloads. <em>Isolated</em>: no route out at all, only VPC-internal — for the most sensitive workloads."],
        ['NAT Gateway & egress cost', "Lets private-subnet resources reach the internet <em>outbound</em> without being reachable inbound. In AWS: charged per-GB processed <em>plus</em> per-hour. A chatty workload calling <code>s3.us-east-1.amazonaws.com</code> through NAT is a shockingly common bill line — use <em>VPC endpoints</em> (private-DNS aliases) to skip NAT for AWS services."],
        ['Security Groups vs NACLs', "<em>Security Group</em>: stateful firewall at the ENI (instance). Return traffic for allowed egress is auto-permitted. Default deny inbound, default allow outbound. <em>NACL</em>: stateless firewall at the subnet boundary — every direction must be allowed explicitly. Use SGs for 95% of rules; NACLs for broad deny lists."],
        ['VPC peering vs Transit Gateway', "<em>Peering</em>: point-to-point, non-transitive (A↔B and B↔C does NOT give A↔C). Fine for a handful of VPCs. <em>Transit Gateway / Hub-VNet</em>: hub-and-spoke, transitive, one place to hold the routing table. Beyond ~5 VPCs, peering meshes turn into spaghetti — reach for a Transit Gateway."],
        ['Private DNS & endpoints', "Each cloud has private DNS resolvers for its services. AWS PrivateLink / VPC endpoints let you reach an AWS API (S3, DynamoDB, etc.) over the internal network without traversing the internet or NAT — cheaper, faster, and doesn’t leak."],
        ['Zero-trust networking', "The direction of travel: instead of a big flat VPN and trusted-network model, every request authenticates and authorises itself, everywhere. Tailscale, Cloudflare Access, Google BeyondCorp — network position stops being a security primitive."],
      ],
      code: "<span class=\"c\"># WireGuard — the minimal-config VPN</span>\n\n<span class=\"c\"># /etc/wireguard/wg0.conf on the server</span>\n<span class=\"k\">[Interface]</span>\nAddress    = 10.100.0.1/24\nListenPort = 51820\nPrivateKey = &lt;server-private-key&gt;\n<span class=\"c\"># NAT clients out through eth0 to reach the wider network</span>\nPostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\nPostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE\n\n<span class=\"k\">[Peer]</span>\nPublicKey  = &lt;laptop-public-key&gt;\nAllowedIPs = 10.100.0.2/32\n\n$ wg-quick up wg0     <span class=\"c\"># start it</span>\n$ wg                  <span class=\"c\"># show peers, last handshake, transfer counts</span>\n\n<span class=\"c\"># A minimal AWS VPC in Terraform — two AZs, public + private subnets</span>\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_vpc\"</span> <span class=\"s\">\"main\"</span> {\n  <span class=\"k\">cidr_block</span>           = <span class=\"s\">\"10.0.0.0/16\"</span>\n  <span class=\"k\">enable_dns_hostnames</span> = <span class=\"n\">true</span>\n}\n\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_subnet\"</span> <span class=\"s\">\"public_a\"</span>  { <span class=\"k\">vpc_id</span>=aws_vpc.main.id  <span class=\"k\">cidr_block</span>=<span class=\"s\">\"10.0.1.0/24\"</span>  <span class=\"k\">availability_zone</span>=<span class=\"s\">\"eu-west-1a\"</span>  <span class=\"k\">map_public_ip_on_launch</span>=<span class=\"n\">true</span> }\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_subnet\"</span> <span class=\"s\">\"public_b\"</span>  { <span class=\"k\">vpc_id</span>=aws_vpc.main.id  <span class=\"k\">cidr_block</span>=<span class=\"s\">\"10.0.2.0/24\"</span>  <span class=\"k\">availability_zone</span>=<span class=\"s\">\"eu-west-1b\"</span>  <span class=\"k\">map_public_ip_on_launch</span>=<span class=\"n\">true</span> }\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_subnet\"</span> <span class=\"s\">\"private_a\"</span> { <span class=\"k\">vpc_id</span>=aws_vpc.main.id  <span class=\"k\">cidr_block</span>=<span class=\"s\">\"10.0.11.0/24\"</span> <span class=\"k\">availability_zone</span>=<span class=\"s\">\"eu-west-1a\"</span> }\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_subnet\"</span> <span class=\"s\">\"private_b\"</span> { <span class=\"k\">vpc_id</span>=aws_vpc.main.id  <span class=\"k\">cidr_block</span>=<span class=\"s\">\"10.0.12.0/24\"</span> <span class=\"k\">availability_zone</span>=<span class=\"s\">\"eu-west-1b\"</span> }\n\n<span class=\"c\"># Save on NAT costs: route S3 traffic through a VPC endpoint</span>\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_vpc_endpoint\"</span> <span class=\"s\">\"s3\"</span> {\n  <span class=\"k\">vpc_id</span>            = aws_vpc.main.id\n  <span class=\"k\">service_name</span>      = <span class=\"s\">\"com.amazonaws.eu-west-1.s3\"</span>\n  <span class=\"k\">vpc_endpoint_type</span> = <span class=\"s\">\"Gateway\"</span>\n}",
      codeCap: 'WireGuard for the tunnel, Terraform for the VPC + subnets across two AZs, a Gateway VPC endpoint to skip NAT for S3. The three primitives that come up on almost every cloud project.',
      code: "<span class=\"c\"># WireGuard — the minimal-config VPN</span>\n\n<span class=\"c\"># /etc/wireguard/wg0.conf on the server</span>\n<span class=\"k\">[Interface]</span>\nAddress    = 10.100.0.1/24\nListenPort = 51820\nPrivateKey = &lt;server-private-key&gt;\n\n<span class=\"k\">[Peer]</span>\nPublicKey  = &lt;laptop-public-key&gt;\nAllowedIPs = 10.100.0.2/32\n\n<span class=\"c\"># Bring it up</span>\n$ wg-quick up wg0\n$ wg   <span class=\"c\"># show peers and last handshake</span>",
      codeCap: 'A dozen lines and a keypair per side. WireGuard is why hand-rolled VPNs became reasonable again.',
      quiz: [
        {
          q: 'What is a site-to-site VPN?',
          options: ['A VPN that only works on one website', 'An encrypted tunnel joining two entire networks (e.g., cloud VPC to on-prem)', 'A VPN for a single user', 'A CDN feature'],
          correct: 1,
          why: 'Contrast with client VPN, which joins one device to a network.',
        },
        {
          q: 'Why is WireGuard often preferred over OpenVPN today?',
          options: ['Older is always better', 'Much smaller codebase, faster, kernel-native on Linux, simple keypair-based config', 'Requires no encryption', 'It is a cloud-only service'],
          correct: 1,
          why: 'Auditable simplicity and speed are its selling points.',
        },
        {
          q: 'What does BGP do?',
          options: ['Encrypts network traffic', 'Exchanges routing information between autonomous systems — how the internet and cloud transit hubs decide where packets go', 'Compresses HTTP', 'Load-balances DNS'],
          correct: 1,
          why: 'A misconfigured BGP announcement can black-hole a country — famously has, more than once.',
        },
        {
          q: 'When would you use a Transit Gateway over VPC peering?',
          options: ['Always — peering is deprecated', 'When you need to connect many VPCs (and possibly on-prem) through a hub with a single routing table — peering scales poorly past a handful of VPCs', 'When cost is your only concern', 'To replace a NAT gateway'],
          correct: 1,
          why: 'Peering is fine for two or three VPCs; beyond that, mesh grows quadratically.',
        },
        {
          q: 'Why does a NAT Gateway show up on cloud bills so often?',
          options: ['It is a subscription service', 'It is priced per-GB of processed traffic — chatty private workloads calling the internet quietly rack up real money', 'It requires a per-user license', 'Because encryption is expensive'],
          correct: 1,
          why: 'VPC endpoints for AWS services skip the NAT and save this line item.',
        },
      ],
    },

    {
      id: 'git',
      part: 2,
      num: '13',
      title: 'Git — Beyond the Basics',
      tag: 'rebase, cherry-pick, bisect, reflog, worktree, hooks — the tools that make git feel like a lever, not a chore.',
      figure: {
        tag: 'Figure 1 · Merge vs rebase, in shape',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
          <line x1="310" y1="20" x2="310" y2="240" stroke-dasharray="4 4" opacity="0.5"/>
          <text x="150" y="38" text-anchor="middle" font-size="10" font-weight="700" stroke="none" class="fig-muted">MERGE</text>
          <text x="470" y="38" text-anchor="middle" font-size="10" font-weight="700" stroke="none" class="fig-muted">REBASE</text>

          <!-- MERGE side -->
          <g fill="currentColor">
            <circle cx="40"  cy="120" r="6"/>
            <circle cx="90"  cy="120" r="6"/>
            <circle cx="140" cy="90"  r="6"/>
            <circle cx="190" cy="90"  r="6"/>
            <circle cx="240" cy="120" r="6"/>
            <circle cx="280" cy="120" r="6" stroke="var(--accent)" stroke-width="2" fill="var(--ground)"/>
          </g>
          <g stroke="currentColor" fill="none">
            <line x1="46" y1="120" x2="84" y2="120"/>
            <line x1="96" y1="118" x2="136" y2="92"/>
            <line x1="146" y1="90"  x2="184" y2="90"/>
            <line x1="196" y1="92"  x2="234" y2="118"/>
            <line x1="96" y1="122" x2="234" y2="122"/>
            <line x1="246" y1="120" x2="274" y2="120"/>
          </g>
          <text x="150" y="180" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">history preserved</text>
          <text x="150" y="196" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">merge commit above</text>
          <text x="285" y="146" font-size="9" stroke="none" fill="var(--accent)" font-weight="700">merge</text>

          <!-- REBASE side -->
          <g fill="currentColor">
            <circle cx="330" cy="120" r="6"/>
            <circle cx="380" cy="120" r="6"/>
            <circle cx="430" cy="120" r="6"/>
            <circle cx="480" cy="120" r="6"/>
            <circle cx="530" cy="120" r="6"/>
            <circle cx="580" cy="120" r="6" stroke="var(--accent)" stroke-width="2" fill="var(--ground)"/>
          </g>
          <g stroke="currentColor" fill="none">
            <line x1="336" y1="120" x2="374" y2="120"/>
            <line x1="386" y1="120" x2="424" y2="120"/>
            <line x1="436" y1="120" x2="474" y2="120"/>
            <line x1="486" y1="120" x2="524" y2="120"/>
            <line x1="536" y1="120" x2="574" y2="120"/>
          </g>
          <text x="470" y="180" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">linear history</text>
          <text x="470" y="196" text-anchor="middle" font-size="10" stroke="none" class="fig-muted">commits replayed on tip</text>
          <text x="585" y="146" font-size="9" stroke="none" fill="var(--accent)" font-weight="700">HEAD</text>
        </svg>`,
        caption: 'Same set of commits, two shapes. Merge preserves the branch history and adds a merge commit on top — honest, unrevised. Rebase replays your commits on the target tip — clean, linear, but only safe on branches you haven\'t pushed yet.',
      },
      intro: "Everyone knows <code>commit</code> and <code>push</code>. Where teams diverge in productivity is what happens next: how they handle history, how they recover from mistakes, how they investigate regressions, and how they resolve the inevitable conflicts. Fluent git users have almost never <em>lost</em> work — because they know git rarely deletes anything, and the reflog is a safety net for almost every catastrophe.\nThis chapter is the second layer of git — rebase, cherry-pick, bisect, reflog, worktree, hooks — the tools that separate a fluent user from someone who fights the tool.",
      concepts: [
        ['Objects, refs, HEAD', "Git stores every version as a <em>commit object</em>, addressable by its SHA-1 hash. <em>Branches</em> are just movable pointers (refs) to commits; <em>tags</em> are immovable ones. <em>HEAD</em> is your current position — usually attached to a branch, occasionally <em>detached</em> pointing at a specific commit. Understanding this dissolves 90% of git confusion."],
        ['Rebase vs merge', "<em>Merge</em> joins two branches with a merge commit, preserving history as-is. <em>Rebase</em> replays your commits on top of another branch, producing linear history. Rule of thumb: merge shared long-lived branches (main), rebase your own local feature branch before pushing to clean up the story."],
        ['Interactive rebase', "<code>git rebase -i main</code> opens an editor listing your commits with actions: <code>pick</code>, <code>reword</code>, <code>edit</code>, <code>squash</code>, <code>fixup</code>, <code>drop</code>, <code>exec</code>. Squash the “fix typo” commits, reword the muddled ones, drop the debug prints. The canonical way to publish a clean series."],
        ['cherry-pick', "Copy a specific commit from one branch onto the current one. <code>git cherry-pick abc123</code>. The idiomatic way to back-port a fix from <code>main</code> to a maintenance branch, or forward-port a fix landed on a release branch to <code>main</code>."],
        ['bisect', "Binary-search history for the commit that introduced a bug. <code>git bisect start; git bisect bad HEAD; git bisect good v2.1.0</code> — git checks out midpoints; you test and mark good/bad; it narrows to the offending commit. Devastatingly effective for regressions in large histories."],
        ['reflog — the safety net', "<code>git reflog</code> lists every position HEAD has occupied over the last ~90 days. Ran a bad <code>reset --hard</code>? Rebase went wrong and lost a commit? The SHA is in the reflog; <code>git reset --hard &lt;sha&gt;</code> gets it back. Nearly every git “disaster” is recoverable via reflog."],
        ['worktree', "<code>git worktree add ../hotfix release/1.4</code> checks out a second branch in a separate directory of the same repo — no clones, no stashing, no branch dance. Perfect for hot-fixing an older release without disturbing your current work. <code>worktree list</code>, <code>worktree remove</code>."],
        ['Stash & sparse checkout', "<em>Stash</em>: temporarily set aside uncommitted changes (<code>git stash push -m note</code>, <code>git stash pop</code>). <em>Sparse checkout</em>: check out only some directories of a monorepo (<code>git sparse-checkout set apps/api</code>) — a lifesaver in huge repos."],
        ['Hooks & pre-commit frameworks', "Scripts git runs at points in its workflow. <em>pre-commit</em>: run linters before allowing a commit. <em>pre-push</em>: run tests. <em>commit-msg</em>: enforce format (Conventional Commits). Managed via the <code>pre-commit</code> framework (<code>.pre-commit-config.yaml</code>) or <code>husky</code>."],
        ['Merge strategies for PRs', "Three common choices: <em>merge commit</em> preserves branch shape; <em>squash</em> collapses the PR to one commit on main (clean history, loses granularity); <em>rebase-merge</em> replays commits linearly (all commits on main). Pick one and be consistent across the team."],
        ['Trunk-based vs GitFlow', "<em>Trunk-based</em>: everyone integrates to <code>main</code> at least daily; feature branches are short-lived (hours to a day). Pairs with feature flags for unreleased work. <em>GitFlow</em>: long-lived <code>develop</code>/<code>release</code>/<code>hotfix</code> branches. Trunk-based wins for most modern CD-driven teams."],
        ['Signing commits', "<code>git commit -S</code> signs a commit with GPG or SSH. GitHub/GitLab shows a green “Verified” badge. In regulated shops, unsigned commits from unknown authors can be rejected outright."],
      ],
      code: "<span class=\"c\"># Rewrite the last four commits before pushing</span>\n$ git rebase -i HEAD~4\n<span class=\"c\"># editor opens:</span>\n<span class=\"c\">#   pick   c8a1f2 add user validation</span>\n<span class=\"c\">#   squash e1b7a9 fix a typo in the previous commit</span>\n<span class=\"c\">#   reword f2c341 initial handler</span>\n<span class=\"c\">#   drop   90b4c8 debug print</span>\n\n<span class=\"c\"># Find the commit that broke tests</span>\n$ git bisect start\n$ git bisect bad HEAD\n$ git bisect good v2.1.0\n<span class=\"c\"># git checks out a midpoint; you run tests</span>\n$ git bisect good   <span class=\"c\"># or bad</span>\n<span class=\"c\"># ...repeats until it names the offender</span>\n$ git bisect reset\n\n<span class=\"c\"># Rescue a “lost” commit after a mis-reset</span>\n$ git reflog\nc8a1f2 HEAD@{0}: reset: moving to HEAD~1\nd1e2f3 HEAD@{1}: commit: the change I panicked and reset away\n$ git reset --hard d1e2f3",
      codeCap: 'You can undo almost anything in git as long as you have committed first. The reflog is your safety net.',
      quiz: [
        {
          q: 'When should you prefer rebase over merge?',
          options: ['On shared long-lived branches like main', 'On your own local feature branch, before pushing — to clean up history and integrate the latest main', 'Never; rebase is always dangerous', 'Always, in every situation'],
          correct: 1,
          why: 'Rewriting shared history is what makes rebase risky. Do it privately, before publishing.',
        },
        {
          q: 'What does interactive rebase let you do?',
          options: ['Nothing extra beyond a normal rebase', 'Squash, reorder, reword, edit, or drop commits before publishing — history cleanup', 'Merge two branches interactively', 'Bisect the tree'],
          correct: 1,
          why: 'The classic use is squashing WIP commits into a clean series before opening a PR.',
        },
        {
          q: 'What is <code>git cherry-pick</code> for?',
          options: ['Selecting the best files to keep', 'Copying a specific commit from one branch onto the current branch', 'Deleting cherry-marked commits', 'Reverting merges'],
          correct: 1,
          why: 'Common when back-porting a fix from main to a release branch.',
        },
        {
          q: 'What does <code>git bisect</code> do?',
          options: ['Splits a branch in two', 'Binary-searches history for the commit that introduced a bug, checking out midpoints for you to test', 'Merges alternating commits', 'Splits a large commit'],
          correct: 1,
          why: 'Devastatingly effective for “this used to work in v1.4 and doesn’t in main.”',
        },
        {
          q: 'You just ran <code>git reset --hard</code> and lost work. First move?',
          options: ['Panic', '<code>git reflog</code> — it lists every HEAD position, so you can recover the SHA of what you lost and reset back to it', 'Reinstall git', 'Restore from a backup, if any'],
          correct: 1,
          why: 'reflog entries persist for 90 days by default. You almost always can recover.',
        },
      ],
    },

    {
      id: 'cloud',
      part: 3,
      num: '17',
      title: 'Cloud Fundamentals',
      tag: 'Regions, VPCs, subnets, storage tiers, managed services, cost — the primitives that AWS, GCP, and Azure all share.',
      figure: {
        tag: 'Figure 1 · Region / AZ / VPC hierarchy',
        svg: `<svg class="figure-svg" viewBox="0 0 620 300" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="20" width="580" height="260" stroke="currentColor"/>
            <text x="35" y="40" font-size="11" font-weight="700" stroke="none">Region · eu-west-1</text>
            <text x="35" y="54" font-size="9" stroke="none" class="fig-muted">geographic area · multiple physically-isolated datacentres</text>
          </g>

          <g>
            <rect x="40" y="80" width="270" height="180" stroke-dasharray="4 4"/>
            <text x="55" y="100" font-size="10" font-weight="700" stroke="none">AZ · eu-west-1a</text>

            <rect x="60" y="120" width="230" height="60"/>
            <text x="70" y="138" font-size="9" font-weight="700" stroke="none" class="fig-em">public subnet 10.0.1.0/24</text>
            <rect x="80" y="146" width="90" height="26"/>
            <text x="125" y="162" text-anchor="middle" font-size="9" stroke="none">LB</text>
            <rect x="180" y="146" width="90" height="26"/>
            <text x="225" y="162" text-anchor="middle" font-size="9" stroke="none">NAT</text>

            <rect x="60" y="190" width="230" height="60"/>
            <text x="70" y="208" font-size="9" font-weight="700" stroke="none">private subnet 10.0.10.0/24</text>
            <rect x="80" y="216" width="90" height="26"/>
            <text x="125" y="232" text-anchor="middle" font-size="9" stroke="none">app</text>
            <rect x="180" y="216" width="90" height="26"/>
            <text x="225" y="232" text-anchor="middle" font-size="9" stroke="none">db</text>
          </g>

          <g>
            <rect x="330" y="80" width="250" height="180" stroke-dasharray="4 4"/>
            <text x="345" y="100" font-size="10" font-weight="700" stroke="none">AZ · eu-west-1b</text>

            <rect x="350" y="120" width="210" height="60"/>
            <text x="360" y="138" font-size="9" font-weight="700" stroke="none" class="fig-em">public subnet 10.0.2.0/24</text>
            <rect x="370" y="146" width="80" height="26"/>
            <text x="410" y="162" text-anchor="middle" font-size="9" stroke="none">LB</text>
            <rect x="460" y="146" width="80" height="26"/>
            <text x="500" y="162" text-anchor="middle" font-size="9" stroke="none">NAT</text>

            <rect x="350" y="190" width="210" height="60"/>
            <text x="360" y="208" font-size="9" font-weight="700" stroke="none">private subnet 10.0.11.0/24</text>
            <rect x="370" y="216" width="80" height="26"/>
            <text x="410" y="232" text-anchor="middle" font-size="9" stroke="none">app</text>
            <rect x="460" y="216" width="80" height="26"/>
            <text x="500" y="232" text-anchor="middle" font-size="9" stroke="none">db-replica</text>
          </g>
        </svg>`,
        caption: 'A production workload lives across multiple AZs inside one region. Public subnets face the internet (LB, NAT); private subnets don\'t. AZs are physically separated so a single datacentre outage takes down one column, not both. Design assumes this failure will happen.',
      },
      intro: "AWS, GCP, and Azure look different on the surface — different names, different consoles, different quirks — but their core primitives are close cousins. Understanding regions, availability zones, VPCs, subnets, security groups, IAM, storage tiers, and managed services is the <em>durable</em> knowledge. Console UIs change every quarter; these concepts don’t.\nThe biggest early wins are architectural: keep private workloads in private subnets, expose only what needs exposing, design across AZs so a single-datacentre failure doesn’t take you out, and stay on managed services until you have a real reason to run your own. The biggest early <em>losses</em> are almost always cost: NAT egress, unused snapshots, forgotten load balancers, cross-AZ traffic. Set up billing alerts on day one.",
      concepts: [
        ['Region & Availability Zone', "<em>Region</em>: a geographic area (<code>eu-west-1</code>, <code>us-central1</code>, <code>westeurope</code>). <em>AZ</em>: an isolated datacentre within a region (typically 3 per region). Multi-AZ = resilience against one DC failure. Multi-region = disaster recovery + latency to distant users. Most workloads need multi-AZ; only some need multi-region."],
        ['VPC / VNet', "Your own isolated network in the cloud account. Choose a CIDR block (<code>10.0.0.0/16</code> = 65k IPs) large enough to slice across AZs. Everything you provision lives inside one VPC. Cross-ref: [[vpn]] for peering, transit gateways, BGP."],
        ['Subnets — public, private, isolated', "A slice of a VPC. <em>Public</em>: routes to the Internet Gateway; put load balancers, bastion. <em>Private</em>: no direct internet; put workloads and databases. <em>Isolated</em>: no route out at all, only VPC-internal — for the most sensitive tier."],
        ['Security Groups vs NACLs', "<em>Security Group</em>: stateful firewall attached to an instance or ENI. Return traffic auto-allowed. Default deny inbound, allow outbound. <em>NACL</em>: stateless firewall at the subnet boundary — every direction must be explicit. Use SGs for 95% of rules; NACLs as coarse subnet-level blocks."],
        ['IAM (identity & access)', "Every cloud has one. Principals (users, roles, service accounts) get policies granting/denying actions on resources. Roles are assumed short-term; long-lived access keys are the classic breach vector. Cross-ref: [[rbac]]."],
        ['Storage tiers', "<em>Object</em>: S3, GCS, Azure Blob — cheap, HTTP-accessible, effectively infinite; use for static assets, backups, artefacts, data lakes. <em>Block</em>: EBS, Persistent Disk, Managed Disk — raw block volumes attached to VMs, for OS disks and databases. <em>File</em>: EFS, Filestore, Azure Files — shared POSIX filesystems for legacy workloads."],
        ['Object storage classes', "S3 Standard → Infrequent Access → Glacier → Deep Archive. Same API, dropping cost per GB and rising retrieval latency. Lifecycle rules move objects automatically after N days. A big lever for archive-heavy workloads."],
        ['Compute options', "<em>VMs</em> (EC2, GCE, Azure VM): most control, most operational overhead. <em>Managed containers</em> (ECS Fargate, Cloud Run, ACI, EKS/GKE/AKS): run containers without provisioning nodes yourself. <em>Serverless functions</em> (Lambda, Cloud Functions): pay per invocation, ideal for event-driven workloads."],
        ['Managed data services', "RDS, Cloud SQL, Azure SQL for relational. DynamoDB, Firestore, Cosmos for NoSQL. MSK, Confluent Cloud, Pub/Sub for streaming. Trade some control for someone else operating backups, failover, patching, encryption. Almost always worth it until you have a specific reason not to."],
        ['Egress & cross-AZ cost', "Ingress is usually free; egress to the internet is metered. Cross-AZ traffic (a Pod in AZ-a talking to a DB in AZ-b) is also metered, though pennies per GB. At scale, these are real bill lines. Design so most traffic stays within an AZ; use VPC endpoints to avoid NAT egress for cloud services."],
        ['Reserved vs on-demand vs spot', "Pricing tiers. <em>On-demand</em>: pay-as-you-go, full price. <em>Reserved instances / Savings Plans</em>: commit to N units for 1–3 years for a 30-60% discount. <em>Spot</em>: buy spare capacity at up to 90% off; provider can reclaim it with 2 minutes notice. Use spot for stateless workers, batch jobs, non-critical CI runners."],
        ['Well-Architected & cost tags', "Every cloud has a “Well-Architected Framework” — pillars of operational excellence, security, reliability, performance, cost, sustainability. Not scripture, but a good checklist. Practical starting point: tag every resource with <code>env</code>, <code>team</code>, <code>service</code> so cost reports mean something."],
      ],
      code: "<span class=\"c\"># A minimal AWS VPC in Terraform</span>\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_vpc\"</span> <span class=\"s\">\"main\"</span> {\n  <span class=\"k\">cidr_block</span> = <span class=\"s\">\"10.0.0.0/16\"</span>\n  <span class=\"k\">tags</span>       = { <span class=\"k\">Name</span> = <span class=\"s\">\"acme-prod\"</span> }\n}\n\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_subnet\"</span> <span class=\"s\">\"public\"</span> {\n  <span class=\"k\">vpc_id</span>            = aws_vpc.main.id\n  <span class=\"k\">cidr_block</span>        = <span class=\"s\">\"10.0.1.0/24\"</span>\n  <span class=\"k\">availability_zone</span> = <span class=\"s\">\"eu-west-1a\"</span>\n  <span class=\"k\">map_public_ip_on_launch</span> = <span class=\"n\">true</span>\n}\n\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_subnet\"</span> <span class=\"s\">\"private\"</span> {\n  <span class=\"k\">vpc_id</span>            = aws_vpc.main.id\n  <span class=\"k\">cidr_block</span>        = <span class=\"s\">\"10.0.10.0/24\"</span>\n  <span class=\"k\">availability_zone</span> = <span class=\"s\">\"eu-west-1a\"</span>\n}",
      codeCap: 'Public and private subnets in one AZ — the starting shape. In real designs you replicate this across two or three AZs.',
      quiz: [
        {
          q: 'What is the difference between a region and an availability zone?',
          options: ['They are the same', 'A region is a geographic area (eu-west-1); an AZ is an isolated datacentre inside that region. Multi-AZ within one region gives resilience', 'AZs are bigger than regions', 'A region has exactly one AZ'],
          correct: 1,
          why: 'Design across at least two AZs for any workload that shouldn’t die when a datacentre burns down.',
        },
        {
          q: 'What goes in a private subnet vs a public one?',
          options: ['Everything in public', 'Databases and internal services in private subnets; load balancers and NAT in public subnets', 'Everything in private', 'It does not matter'],
          correct: 1,
          why: 'The internet talks to your public subnet; your workloads talk to each other in private.',
        },
        {
          q: 'What is a security group?',
          options: ['A team of people', 'A stateful firewall attached to a cloud resource — return traffic for allowed outbound is automatically permitted', 'A shared SSH key set', 'A VPN group'],
          correct: 1,
          why: 'Contrast with NACLs, which are stateless and act at the subnet boundary.',
        },
        {
          q: 'When would you choose object storage (S3) over block storage (EBS)?',
          options: ['Never', 'For static files, backups, artefacts, images — anything treated as a whole blob. Block storage is for VM disks and databases needing raw block access', 'They are interchangeable', 'Only for backups'],
          correct: 1,
          why: 'Object storage is cheaper, hugely more scalable, and speaks HTTP.',
        },
        {
          q: 'Why lean on managed services early?',
          options: ['They are cheaper than self-hosting for tiny workloads', 'They remove operational burden (patching, backups, failover) so a small team can focus on their application', 'They are always faster', 'They are required by law'],
          correct: 1,
          why: 'Self-host later when you have specific reasons — cost at scale, unusual requirements, hard performance goals.',
        },
      ],
    },

    {
      id: 'rbac',
      part: 3,
      num: '18',
      title: 'RBAC, IAM & Access Control',
      tag: 'Who can do what, to which resource, under which conditions — principals, roles, policies, workload identity, least privilege.',
      figure: {
        tag: 'Figure 1 · Principal · Role · Resource',
        svg: `<svg class="figure-svg" viewBox="0 0 620 250" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="80" width="150" height="70"/>
            <text x="95" y="102" text-anchor="middle" font-size="11" font-weight="700" stroke="none">Principal</text>
            <text x="95" y="120" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">user · group · SA</text>
            <text x="95" y="136" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">workload identity</text>
          </g>

          <path d="M 170 115 L 218 115" stroke="currentColor"/><polygon points="218,115 213,112 213,118" fill="currentColor"/>
          <text x="194" y="107" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">is assigned</text>

          <g>
            <rect x="220" y="80" width="150" height="70" stroke="var(--accent)"/>
            <text x="295" y="102" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">Role</text>
            <text x="295" y="120" text-anchor="middle" font-size="9" stroke="none" class="fig-em">bundle of verbs</text>
            <text x="295" y="136" text-anchor="middle" font-size="9" stroke="none" class="fig-em">on resources</text>
          </g>

          <path d="M 370 115 L 418 115" stroke="currentColor"/><polygon points="418,115 413,112 413,118" fill="currentColor"/>
          <text x="394" y="107" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">grants</text>

          <g>
            <rect x="420" y="80" width="180" height="70"/>
            <text x="510" y="102" text-anchor="middle" font-size="11" font-weight="700" stroke="none">Resource · verb</text>
            <text x="510" y="120" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">s3:GetObject on acme-logs</text>
            <text x="510" y="136" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">get, list, watch on pods</text>
          </g>

          <g stroke="var(--accent)" fill="none" stroke-dasharray="3 3">
            <path d="M 95 150 Q 95 200 510 200 Q 510 200 510 150"/>
            <text x="300" y="220" text-anchor="middle" font-size="10" stroke="none" fill="var(--accent)" font-weight="700">Never bind a principal to a resource directly.  Only through a role.</text>
          </g>
        </svg>`,
        caption: 'Every access-control system reduces to this: a principal is assigned a role, the role grants verbs on resources. The rule that keeps you sane at scale — never grant a resource directly to a principal. Change the role once; every principal wearing it moves with you.',
      },
      intro: "Access control decides who can do what, to which resource, under which conditions. <em>RBAC</em> — Role-Based Access Control — is the dominant model in cloud and Kubernetes: grant permissions to <em>roles</em>, assign roles to <em>principals</em>, never grant permissions to principals directly. That way you change the role once and everyone assigned inherits the change.\nCloud platforms model the same primitives — principals, permissions, resources, policies — under the name <em>IAM</em>. AWS IAM, GCP IAM, Azure Entra ID all do the same job with different words. The mature approach layers identity on top: humans authenticate via SSO to an identity provider (Okta, Google Workspace, Azure AD), and machines authenticate via <em>workload identity</em> (short-lived tokens bound to a workload) instead of long-lived static credentials.",
      concepts: [
        ['Principal', "The “who.” A human user (via SSO), a group, a role, a service account, or a workload identity. Everything that acts against an API authenticates <em>as</em> some principal."],
        ['Authentication vs authorization', "<em>AuthN</em>: proving who you are (a password + MFA, an OIDC token, a cert). <em>AuthZ</em>: deciding what you may do. Distinct concerns; different failures (401 vs 403). RBAC/IAM are authorization models."],
        ['Role', "A named bundle of permissions. Attached to principals. Permissions are never granted directly to a user in a mature system — always via role. Change the role, everyone inherits."],
        ['Permission / Action / Verb', "The “what.” Kubernetes RBAC uses verbs (<code>get</code>, <code>list</code>, <code>watch</code>, <code>create</code>, <code>update</code>, <code>patch</code>, <code>delete</code>). AWS IAM uses actions (<code>s3:PutObject</code>, <code>ec2:DescribeInstances</code>). GCP uses roles/permissions like <code>storage.objects.create</code>."],
        ['Resource', "The “which.” A specific S3 bucket ARN, a K8s namespace, a database, a Vault path. Policies match on resource patterns: <code>arn:aws:s3:::acme-logs/*</code>, <code>projects/acme/topics/orders</code>, <code>secret/data/prod/*</code>."],
        ['Policy conditions', "The “under which conditions.” AWS IAM policies support <code>Condition</code> blocks (<code>aws:SourceIp</code>, <code>aws:MultiFactorAuthPresent</code>, <code>aws:PrincipalTag/team</code>). K8s RBAC has less, but combined with OPA/Kyverno it gets the same expressiveness."],
        ['Policy — allow / deny / evaluate', "AWS IAM defaults to deny; an explicit <code>Deny</code> anywhere overrides any <code>Allow</code>. GCP is deny-by-default with hierarchical inheritance. K8s RBAC is allow-only (there’s no explicit deny). Understanding the evaluation model is how you debug “why can’t I do X?”"],
        ['Kubernetes RBAC', "<em>Role</em>: scoped to a namespace. <em>ClusterRole</em>: cluster-wide. <em>RoleBinding</em> / <em>ClusterRoleBinding</em>: attach a role to a subject (user, group, ServiceAccount). Verify: <code>kubectl auth can-i list pods --as=alice -n prod</code>."],
        ['Service accounts (K8s) & workload identity (cloud)', "Non-human identities. K8s Pods run as a ServiceAccount and mount its token. Cloud workload identity (IRSA on EKS, Workload Identity on GKE, Managed Identity on Azure) binds a cloud IAM role to a K8s ServiceAccount so the Pod calls cloud APIs with automatic short-lived credentials — no static access keys anywhere."],
        ['Least privilege', "Grant only what the principal needs. Broad roles like <code>*</code> are how one compromised credential becomes a whole-account breach. Start narrow, add permissions when something fails, review periodically."],
        ['Break-glass access', "Emergency admin access, tightly logged and time-boxed. In practice: a role that must be assumed with MFA and a stated ticket number, alerts on assumption, auto-expires."],
        ['Audit logs', "Every serious cloud/K8s API logs every AuthN and AuthZ decision. AWS CloudTrail, GCP Audit Logs, K8s audit policy → SIEM. If it wasn’t logged, it didn’t happen — the first thing an incident-response team asks for."],
      ],
      code: "<span class=\"c\"># Kubernetes RBAC — a Role and RoleBinding in one namespace</span>\n<span class=\"k\">apiVersion</span>: rbac.authorization.k8s.io/v1\n<span class=\"k\">kind</span>: Role\n<span class=\"k\">metadata</span>:\n  <span class=\"k\">namespace</span>: <span class=\"s\">prod</span>\n  <span class=\"k\">name</span>: <span class=\"s\">pod-reader</span>\n<span class=\"k\">rules</span>:\n  - <span class=\"k\">apiGroups</span>: [<span class=\"s\">\"\"</span>]\n    <span class=\"k\">resources</span>: [<span class=\"s\">\"pods\"</span>, <span class=\"s\">\"pods/log\"</span>]\n    <span class=\"k\">verbs</span>: [<span class=\"s\">\"get\"</span>, <span class=\"s\">\"list\"</span>, <span class=\"s\">\"watch\"</span>]\n---\n<span class=\"k\">apiVersion</span>: rbac.authorization.k8s.io/v1\n<span class=\"k\">kind</span>: RoleBinding\n<span class=\"k\">metadata</span>:\n  <span class=\"k\">namespace</span>: <span class=\"s\">prod</span>\n  <span class=\"k\">name</span>: <span class=\"s\">dev-read-pods</span>\n<span class=\"k\">subjects</span>:\n  - <span class=\"k\">kind</span>: Group\n    <span class=\"k\">name</span>: <span class=\"s\">devs</span>\n<span class=\"k\">roleRef</span>:\n  <span class=\"k\">kind</span>: Role\n  <span class=\"k\">name</span>: <span class=\"s\">pod-reader</span>\n  <span class=\"k\">apiGroup</span>: rbac.authorization.k8s.io",
      codeCap: 'The Role defines allowed actions. The RoleBinding says which subjects hold that Role in this namespace.',
      quiz: [
        {
          q: 'In RBAC, permissions are granted to…',
          options: ['Individual users directly', 'Roles, which are then assigned to users, groups, or service accounts', 'Only to resources', 'Only to root'],
          correct: 1,
          why: 'Granting to roles keeps changes small: change the role once, everyone assigned inherits it.',
        },
        {
          q: 'What is “principle of least privilege”?',
          options: ['Give admins the least amount of power possible', 'Grant each principal only the permissions it actually needs, and no more', 'Reduce the number of users', 'Deny all requests by default'],
          correct: 1,
          why: 'A compromised credential can only do what its role permits — keep the surface area small.',
        },
        {
          q: 'What is a Kubernetes service account?',
          options: ["A human user’s login", 'A non-human identity attached to Pods so the workload can call the API with a specific set of permissions', 'The cluster admin', 'A billing account'],
          correct: 1,
          why: 'Every Pod gets one, even the default; production designs use dedicated ones with tight roles.',
        },
        {
          q: 'What is the difference between a Role and a ClusterRole in K8s RBAC?',
          options: ['They are the same', 'A Role is scoped to a namespace; a ClusterRole is cluster-wide', 'ClusterRole is deprecated', 'Role is only for admins'],
          correct: 1,
          why: 'ClusterRole + ClusterRoleBinding for cluster-wide; Role + RoleBinding within a namespace.',
        },
        {
          q: 'Why prefer workload identity over long-lived static credentials?',
          options: ['Static credentials are faster', 'Workload identity (IRSA, GKE Workload Identity, Azure Managed Identity) rotates automatically and cannot be leaked the same way a static key can', 'Static keys are cheaper', 'No real difference'],
          correct: 1,
          why: 'Static access keys committed to git are the classic breach story. Workload identity avoids the whole class.',
        },
      ],
    },

    {
      id: 'databases',
      part: 4,
      num: '19',
      title: 'Databases, Migrations & Proxies',
      tag: 'Scaling around the database — pools, replicas, migrations, transactions, and the tools that hide the seams.',
      figure: {
        tag: 'Figure 1 · Scale around the primary, not through it',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="90" width="120" height="60"/>
            <text x="80" y="112" text-anchor="middle" font-size="11" font-weight="700" stroke="none">app fleet</text>
            <text x="80" y="128" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">2000 conns</text>
          </g>
          <path d="M 140 120 L 178 120" stroke="currentColor"/><polygon points="178,120 173,117 173,123" fill="currentColor"/>
          <g>
            <rect x="180" y="90" width="140" height="60" stroke="var(--accent)"/>
            <text x="250" y="112" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">PgBouncer</text>
            <text x="250" y="128" text-anchor="middle" font-size="9" stroke="none" class="fig-em">txn pool</text>
          </g>
          <g fill="currentColor">
            <path d="M 320 105 L 400 55" stroke="currentColor"/><polygon points="400,55 392,55 396,61" fill="currentColor"/>
            <text x="360" y="70" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">writes</text>
            <path d="M 320 135 L 400 190" stroke="currentColor"/><polygon points="400,190 392,187 396,183" fill="currentColor"/>
            <text x="360" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">reads (with lag)</text>
          </g>
          <g>
            <rect x="400" y="30" width="180" height="60"/>
            <text x="490" y="52" text-anchor="middle" font-size="12" font-weight="700" stroke="none">primary</text>
            <text x="490" y="68" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">20 real conns · writes go here</text>

            <rect x="400" y="120" width="180" height="40"/>
            <text x="490" y="142" text-anchor="middle" font-size="10" font-weight="700" stroke="none">read replica A</text>

            <rect x="400" y="170" width="180" height="40"/>
            <text x="490" y="192" text-anchor="middle" font-size="10" font-weight="700" stroke="none">read replica B</text>

            <path d="M 490 90 L 490 118" stroke="currentColor" stroke-dasharray="2 2" opacity="0.5"/>
            <path d="M 490 90 L 490 168" stroke="currentColor" stroke-dasharray="2 2" opacity="0.5"/>
            <text x="590" y="130" text-anchor="middle" font-size="9" stroke="none" class="fig-muted" transform="rotate(90 590 130)">replication</text>
          </g>
        </svg>`,
        caption: 'The primary is the bottleneck; you scale around it. PgBouncer funnels 2000 chatty app connections into ~20 real Postgres backends. Reads can go to replicas — with the caveat that replication lag makes read-your-writes unreliable there.',
      },
      intro: "Databases don’t scale by scaling the database process — they scale by <em>scaling around it</em>: read replicas for read load, connection pools to keep the number of open connections sane, proxies (ProxySQL, PgBouncer, RDS Proxy) that sit between your app and the database managing both, sharding when a single primary really can’t take the write load.\nAlongside that operational side is <em>schema migrations</em>: how you change the shape of a running database without downtime, and how you keep the code and the schema in lockstep across environments. And underlying it all: transactions and isolation levels — the guarantees that let you reason about concurrent writes at all.",
      concepts: [
        ['SQL vs NoSQL — pick by shape', "<em>SQL</em> (Postgres, MySQL): strong schema, joins, ACID transactions. Default choice for most business data. <em>Document</em> (MongoDB, DynamoDB, Firestore): schema-less, single-document atomicity, huge horizontal scale. <em>Key-value</em> (Redis, Memcached): the fastest thing there is at what it does. <em>Time-series</em> (InfluxDB, TimescaleDB): metrics, IoT. <em>Graph</em> (Neo4j): relationships as first-class."],
        ['Transactions & ACID', "<em>Atomicity</em>: all or nothing. <em>Consistency</em>: constraints hold at boundaries. <em>Isolation</em>: concurrent transactions don’t see each other’s partial work. <em>Durability</em>: committed data survives a crash. SQL databases give you all four; NoSQL trades some for scale."],
        ['Isolation levels', "<em>Read Committed</em> (Postgres default): no dirty reads. <em>Repeatable Read</em>: no non-repeatable reads. <em>Serializable</em>: appears fully serial, at real cost. Understanding these prevents subtle bugs where two concurrent updates lose one write."],
        ['Connection pooling', "Every DB connection costs the server memory and a backend process (thousands of connections make Postgres unhappy fast). Applications open a pool of a fixed size and reuse connections rather than reconnecting per request. Configure pool size sensibly — usually 2–4× CPU count."],
        ['PgBouncer', "The connection pooler for PostgreSQL. Three pool modes: <em>session</em> (one client owns one connection for its session), <em>transaction</em> (connection released after each transaction), <em>statement</em> (after each statement). Transaction mode is the sweet spot — highest concurrency, works with most apps."],
        ['ProxySQL', "MySQL-aware proxy. Speaks the MySQL wire protocol so your app connects to ProxySQL as if it were MySQL. Features: connection pooling, read/write split (SELECT → replica, INSERT/UPDATE → primary), query rules (kill runaway queries, route heavy ones to specific hosts), transparent failover."],
        ['Read replica & replication lag', "A follower database that streams writes from the primary. Reads can be served from replicas; writes always to primary. <em>Replication lag</em>: replicas run slightly behind — reads-after-writes may not see the write. For read-your-writes traffic, either send back to primary or use synchronous replicas."],
        ['Failover & HA', "When the primary dies, promote a replica. Managed services (RDS Multi-AZ, Aurora, Cloud SQL HA, Patroni self-hosted) automate the promotion and DNS/proxy repointing. Application-side: use a proxy that follows the primary automatically."],
        ['Backups & PITR', "Nightly logical backups (<code>pg_dump</code>, <code>mysqldump</code>) for portability + weekly-monthly retention. <em>Point-In-Time Recovery</em>: continuous archive of WAL/binlog so you can restore to any second within the retention window. Test restores quarterly — an untested backup is not a backup."],
        ['Migrations', "Versioned schema changes, tracked in order. Tools: <em>Flyway</em>, <em>Liquibase</em> (Java-agnostic), <em>Alembic</em> (Python), <em>Rails migrations</em>, <em>sqlx migrate</em> (Rust), <em>Prisma Migrate</em>, <em>Atlas</em>. Each migration file is applied once, ever; the DB tracks which have run."],
        ['Zero-downtime migrations', "Forward-safe pattern for adding a NOT NULL column to a huge table: add nullable → backfill in batches → application writes both → flip NOT NULL. For renames: add new column, dual-write, backfill, cut over reads, drop old. Never a <code>ALTER TABLE … NOT NULL DEFAULT …</code> on a 50M-row table in one shot — that’s a locked-table outage."],
        ['Admin UIs — phpMyAdmin, pgAdmin, Adminer, DBeaver', "Web/desktop UIs for ad-hoc querying, browsing, and running one-off DDL. <em>phpMyAdmin</em>: the long-standing MySQL/MariaDB UI. <em>pgAdmin</em>: Postgres equivalent. <em>Adminer</em>: single-file, minimal, multi-DB. <em>DBeaver</em>: desktop, powerful, all databases. Never expose them to the internet without at least SSO + IP allow-list."],
        ['Query performance', "The three tools worth learning: <code>EXPLAIN ANALYZE</code> to see how a query runs, indexes to make it fast, <code>pg_stat_statements</code> / MySQL <code>performance_schema</code> to find the queries costing you the most. Missing indexes are the #1 cause of slow production databases."],
      ],
      code: "<span class=\"c\"># pgbouncer.ini — transaction pooling in front of Postgres</span>\n<span class=\"k\">[databases]</span>\napp = host=db-primary.internal port=5432 dbname=app\n\n<span class=\"k\">[pgbouncer]</span>\nlisten_addr = 0.0.0.0\nlisten_port = 6432\nauth_type = md5\nauth_file = /etc/pgbouncer/userlist.txt\npool_mode = transaction     <span class=\"c\">; hand connection back after each txn</span>\nmax_client_conn = 2000      <span class=\"c\">; app-facing connections</span>\ndefault_pool_size = 20      <span class=\"c\">; actual Postgres connections per DB/user</span>",
      codeCap: 'Two thousand chatty app connections funnel into twenty real Postgres backends. Postgres stays happy; the app never blocks on a socket.',
      quiz: [
        {
          q: 'Why use connection pooling in front of a database?',
          options: ['Because databases refuse concurrent connections', 'Each connection costs memory and a backend process; pooling reuses a small set of long-lived connections across many requests', 'Pooling makes each query return faster', 'It is legally required'],
          correct: 1,
          why: 'Postgres in particular gets unhappy with many idle connections. PgBouncer sits between.',
        },
        {
          q: 'What is ProxySQL?',
          options: ['A SQL editor', 'A MySQL-aware proxy that pools connections, routes reads to replicas, and hides failover from the application', 'A backup tool', 'A monitoring agent'],
          correct: 1,
          why: 'Speaking the MySQL protocol means the app connects to ProxySQL as if it were MySQL itself.',
        },
        {
          q: 'What is a read replica for?',
          options: ['Backing up the primary', 'Serving read queries so the primary handles only writes and read-your-writes traffic', 'Testing schema changes', 'Storing archives'],
          correct: 1,
          why: 'Replicas share the read load. They also make good failover candidates.',
        },
        {
          q: 'What is the main risk of reading from a replica?',
          options: ['The queries fail', 'Replication lag — recent writes on the primary may not yet be visible on the replica', 'Higher cost per query', 'Replicas are read-only, that’s the risk'],
          correct: 1,
          why: 'Route reads that must see recent writes back to the primary or use synchronous replicas.',
        },
        {
          q: 'What is the safe way to add a NOT NULL column to a huge table in production?',
          options: ['<code>ALTER TABLE t ADD COLUMN c INT NOT NULL DEFAULT 0</code> in a single transaction', 'Multi-step: add nullable → backfill in batches → flip to NOT NULL (or use a DB feature that adds the column with a default without a table rewrite)', 'Delete and recreate the table', 'Migrations always require downtime — accept it'],
          correct: 1,
          why: 'A locking rewrite of a 50M-row table is a production outage. Break it into small, reversible steps.',
        },
      ],
    },

    {
      id: 'waf',
      part: 4,
      num: '23',
      title: 'WAF & Application Security',
      tag: 'A firewall for HTTP, and the OWASP top-10 it exists to blunt — WAF, CSP, rate limiting, bot defence, secure headers.',
      figure: {
        tag: 'Figure 1 · Request path with the WAF in front',
        svg: `<svg class="figure-svg" viewBox="0 0 620 240" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="90" width="90" height="60"/>
            <text x="65" y="112" text-anchor="middle" font-size="10" font-weight="700" stroke="none">client</text>
            <text x="65" y="128" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">any origin</text>
          </g>
          <path d="M 110 120 L 138 120" stroke="currentColor"/><polygon points="138,120 133,117 133,123" fill="currentColor"/>

          <g>
            <rect x="140" y="60" width="180" height="120" stroke="var(--accent)"/>
            <text x="230" y="82" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">WAF</text>
            <line x1="160" y1="92" x2="300" y2="92" stroke-dasharray="2 3" opacity="0.4"/>
            <text x="230" y="112" text-anchor="middle" font-size="10" stroke="none">OWASP CRS rules</text>
            <text x="230" y="128" text-anchor="middle" font-size="10" stroke="none">SQLi · XSS · SSRF</text>
            <text x="230" y="144" text-anchor="middle" font-size="10" stroke="none">rate limit / bot</text>
            <text x="230" y="164" text-anchor="middle" font-size="9" stroke="none" class="fig-em">block · challenge · allow</text>
          </g>

          <path d="M 320 120 L 358 120" stroke="currentColor"/><polygon points="358,120 353,117 353,123" fill="currentColor"/>
          <text x="339" y="112" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">allowed</text>

          <g>
            <rect x="360" y="90" width="120" height="60"/>
            <text x="420" y="112" text-anchor="middle" font-size="10" font-weight="700" stroke="none">reverse proxy</text>
            <text x="420" y="128" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">TLS · route</text>
          </g>

          <path d="M 480 120 L 518 120" stroke="currentColor"/><polygon points="518,120 513,117 513,123" fill="currentColor"/>

          <g>
            <rect x="520" y="90" width="80" height="60"/>
            <text x="560" y="112" text-anchor="middle" font-size="10" font-weight="700" stroke="none">app</text>
            <text x="560" y="128" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">business logic</text>
          </g>

          <g stroke="var(--accent)" fill="var(--accent)" stroke-width="1.5">
            <path d="M 230 180 L 230 210" stroke-dasharray="3 3"/>
            <text x="230" y="222" text-anchor="middle" font-size="10" stroke="none" font-weight="700">blocked · 403 · logged to SIEM</text>
          </g>
        </svg>`,
        caption: 'The WAF is a Layer-7 filter that sees every request before your app does. It matches against a ruleset (OWASP CRS + custom), blocks SQL-injection, XSS, path traversal, rate-limits abusive clients, and logs everything a SIEM might want. Not a substitute for safe code — a durable second layer.',
      },
      intro: "A Web Application Firewall inspects HTTP traffic before it reaches your app, dropping requests that look like classic attacks — SQL injection, XSS, command injection, path traversal, log4shell — and rate-limiting abusive clients. It’s Layer-7 protection, matched to the OWASP Top 10 by design.\nA WAF is <em>not</em> a substitute for writing safe code (parameterised queries, output encoding, CSRF tokens, secure cookies, dependency auditing). It’s a durable second layer that catches what your code missed and buys you time to patch. The dominant options are Cloudflare WAF, AWS WAF, GCP Cloud Armor, Azure Front Door WAF, and open-source ModSecurity with the OWASP Core Rule Set.",
      concepts: [
        ['WAF', "A firewall that understands HTTP — inspects method, path, headers, cookies, and body against rulesets, blocking or challenging suspicious traffic. Managed rule groups (AWS Managed Rules, Cloudflare Managed Ruleset, OWASP CRS) give you a strong baseline; add custom rules for your app-specific patterns."],
        ['OWASP Top 10', "The reference list of the most common web application vulnerability classes. Rotates every few years but the themes are stable: <em>injection</em>, <em>broken authentication</em>, <em>sensitive data exposure</em>, <em>broken access control</em>, <em>misconfiguration</em>, <em>XSS</em>, <em>insecure deserialisation</em>, <em>vulnerable components</em>, <em>insufficient logging</em>, <em>SSRF</em>."],
        ['SQL Injection', "Coercing a database into running attacker-supplied SQL by concatenating input into queries. Fix: <em>parameterised queries</em> / prepared statements. Never string-build SQL. ORMs handle this by default; the danger is when someone drops down to raw SQL with concatenation."],
        ['XSS — Cross-Site Scripting', "Injecting script that runs in another user’s browser under your site’s origin. Three flavours: reflected, stored, DOM-based. Fix: <em>output-encode</em> everything user-supplied by default (frameworks like React do this), set a strict <em>Content Security Policy</em>, mark session cookies <code>HttpOnly</code> so JavaScript can’t read them."],
        ['CSRF — Cross-Site Request Forgery', "Tricking a logged-in browser into making a state-changing request using its own cookies. Fix: <em>SameSite</em> cookies (<code>SameSite=Lax</code> or <code>Strict</code>) — this removes most of the attack surface by itself. For remaining cases: CSRF tokens on state-changing requests."],
        ['SSRF — Server-Side Request Forgery', "Coercing the server into making requests on your behalf — often to internal cloud metadata endpoints (<code>169.254.169.254</code>) to steal credentials. Fix: restrict outbound network for the app (egress firewall), validate/allow-list URLs before fetching, use metadata service v2 (AWS IMDSv2) which requires a session token."],
        ['Content Security Policy (CSP)', "An HTTP header telling the browser which script/style/font/img sources are allowed. <code>Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123';</code> — kills most XSS even if injection happens. Deploy in <code>Content-Security-Policy-Report-Only</code> first to find violations before enforcing."],
        ['Secure headers', "Free wins: <code>Strict-Transport-Security</code> (HSTS, forces HTTPS forever), <code>X-Content-Type-Options: nosniff</code>, <code>Referrer-Policy: strict-origin-when-cross-origin</code>, <code>Permissions-Policy</code> (formerly Feature-Policy), <code>X-Frame-Options: DENY</code>. Check yours with securityheaders.com."],
        ['Rate limiting', "Cap requests per IP, per token, per route, per user. First line of defence against credential stuffing, scraping, and casual abuse. Do it at the WAF/CDN (cheapest), the reverse proxy ([[nginx]] <code>limit_req_zone</code>), or the app (Redis-backed sliding-window)."],
        ['Bot & credential-stuffing defence', "Modern attackers use botnets to try leaked-password lists against your login. Defences: bot detection at the WAF (Cloudflare Bot Management, AWS WAF Bot Control), CAPTCHA/JS challenges on suspicious logins, MFA enforcement, monitoring for password-spray patterns."],
        ['Vulnerable components', "Your CVE exposure is your dependency tree. Automate scanning: <code>npm audit</code>, <code>pip-audit</code>, <code>trivy</code>/<code>grype</code> on images, GitHub Dependabot, Snyk. Cross-ref: [[packages]]."],
        ['Logging & incident response', "Log auth events, denied requests, admin actions with enough context to reconstruct what happened. Feed to a SIEM (Splunk, Elastic Security, Sumo Logic, Grafana Loki). An intrusion you can’t reconstruct is an intrusion you don’t know the scope of."],
      ],
      code: "<span class=\"c\"># AWS WAF rule (JSON, via Terraform) — block SQLi in query strings</span>\n<span class=\"k\">resource</span> <span class=\"s\">\"aws_wafv2_web_acl\"</span> <span class=\"s\">\"main\"</span> {\n  <span class=\"k\">name</span>  = <span class=\"s\">\"acme-waf\"</span>\n  <span class=\"k\">scope</span> = <span class=\"s\">\"REGIONAL\"</span>\n\n  <span class=\"k\">default_action</span> { <span class=\"k\">allow</span> {} }\n\n  <span class=\"k\">rule</span> {\n    <span class=\"k\">name</span>     = <span class=\"s\">\"AWSManagedRulesSQLiRuleSet\"</span>\n    <span class=\"k\">priority</span> = <span class=\"n\">10</span>\n    <span class=\"k\">override_action</span> { <span class=\"k\">none</span> {} }\n    <span class=\"k\">statement</span> {\n      <span class=\"k\">managed_rule_group_statement</span> {\n        <span class=\"k\">name</span>        = <span class=\"s\">\"AWSManagedRulesSQLiRuleSet\"</span>\n        <span class=\"k\">vendor_name</span> = <span class=\"s\">\"AWS\"</span>\n      }\n    }\n    <span class=\"k\">visibility_config</span> {\n      <span class=\"k\">metric_name</span>                = <span class=\"s\">\"sqli\"</span>\n      <span class=\"k\">cloudwatch_metrics_enabled</span> = <span class=\"n\">true</span>\n      <span class=\"k\">sampled_requests_enabled</span>   = <span class=\"n\">true</span>\n    }\n  }\n}",
      codeCap: 'Managed rule groups (AWS/Cloudflare/GCP) give you sensible defaults you can layer with your own custom rules.',
      quiz: [
        {
          q: 'What does a WAF do that a normal network firewall does not?',
          options: ['Nothing different', 'Understands HTTP — inspects method, path, headers, and body against attack patterns rather than just IPs and ports', 'Runs on the client', 'Encrypts requests'],
          correct: 1,
          why: 'A Layer-7 firewall matched to the OWASP top-10 patterns.',
        },
        {
          q: 'What is SQL injection, in one sentence?',
          options: ['A performance problem in databases', 'Coercing a database into running attacker-controlled SQL by concatenating untrusted input into queries', 'A migration failure', 'A backup restore going wrong'],
          correct: 1,
          why: 'Parameterised queries eliminate the whole class. Never string-build SQL.',
        },
        {
          q: 'What is XSS?',
          options: ['A performance issue in JavaScript engines', 'Cross-Site Scripting — injecting script that runs in another user’s browser under your site’s origin', 'A serialisation format', 'A cross-region storage service'],
          correct: 1,
          why: 'Output-encode by default, add a Content Security Policy, mark session cookies HttpOnly.',
        },
        {
          q: 'What is CSRF and one common mitigation?',
          options: ['A DNS record type', 'Cross-Site Request Forgery — tricking a logged-in browser into using its own credentials; mitigated with SameSite cookies and CSRF tokens on state-changing requests', 'A cloud-only threat', 'The name of a browser API'],
          correct: 1,
          why: '<code>SameSite=Lax</code> or <code>Strict</code> on session cookies removes most of the danger.',
        },
        {
          q: 'A WAF replaces the need to write secure code — true or false?',
          options: ['True', 'False — a WAF is a durable second layer, not a substitute for parameterised queries, output encoding, safe defaults, and code review', 'True, if you use a managed WAF', 'Only for small apps'],
          correct: 1,
          why: 'Attackers eventually get around every filter. Fix the underlying code paths.',
        },
      ],
    },

    {
      id: 'apis',
      part: 4,
      num: '24',
      title: 'APIs, SDKs & Real-time',
      tag: 'HTTP semantics, SDKs, auth, versioning, OpenAPI — plus SSE, WebSocket, and gRPC for the moments HTTP request-response isn’t enough.',
      figure: {
        tag: 'Figure 1 · When to pick which transport',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="30" width="140" height="200"/>
            <text x="90" y="52" text-anchor="middle" font-size="11" font-weight="700" stroke="none">REST / JSON</text>
            <line x1="30" y1="62" x2="150" y2="62" opacity="0.4"/>
            <text x="90" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">request → response</text>
            <text x="90" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">cacheable</text>
            <text x="90" y="114" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">stateless</text>
            <text x="90" y="150" text-anchor="middle" font-size="9" stroke="none" class="fig-em" font-weight="700">DEFAULT</text>
            <text x="90" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">CRUD</text>
            <text x="90" y="196" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">integrations</text>
            <text x="90" y="212" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">public APIs</text>
          </g>

          <g>
            <rect x="180" y="30" width="140" height="200"/>
            <text x="250" y="52" text-anchor="middle" font-size="11" font-weight="700" stroke="none">SSE</text>
            <line x1="190" y1="62" x2="310" y2="62" opacity="0.4"/>
            <text x="250" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">server → client</text>
            <text x="250" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">one-way stream</text>
            <text x="250" y="114" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">auto-reconnect</text>
            <text x="250" y="150" text-anchor="middle" font-size="9" stroke="none" class="fig-em" font-weight="700">STREAM DOWN</text>
            <text x="250" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">LLM tokens</text>
            <text x="250" y="196" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">notifications</text>
            <text x="250" y="212" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">live dashboards</text>
          </g>

          <g>
            <rect x="340" y="30" width="140" height="200" stroke="var(--accent)"/>
            <text x="410" y="52" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">WebSocket</text>
            <line x1="350" y1="62" x2="470" y2="62" opacity="0.4"/>
            <text x="410" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-em">both directions</text>
            <text x="410" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">persistent</text>
            <text x="410" y="114" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">stateful</text>
            <text x="410" y="150" text-anchor="middle" font-size="9" stroke="none" class="fig-em" font-weight="700">FULL DUPLEX</text>
            <text x="410" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">chat</text>
            <text x="410" y="196" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">collab editors</text>
            <text x="410" y="212" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">multiplayer</text>
          </g>

          <g>
            <rect x="500" y="30" width="100" height="200"/>
            <text x="550" y="52" text-anchor="middle" font-size="11" font-weight="700" stroke="none">gRPC</text>
            <line x1="510" y1="62" x2="590" y2="62" opacity="0.4"/>
            <text x="550" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">HTTP/2</text>
            <text x="550" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">protobuf</text>
            <text x="550" y="114" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">typed</text>
            <text x="550" y="150" text-anchor="middle" font-size="9" stroke="none" class="fig-em" font-weight="700">INTERNAL</text>
            <text x="550" y="180" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">service-to-</text>
            <text x="550" y="194" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">service, high</text>
            <text x="550" y="208" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">throughput</text>
          </g>
        </svg>`,
        caption: 'Pick the boring option by default. REST covers most needs. Reach for SSE when the server has updates to push; WebSocket when the client also pushes back frequently; gRPC when the boundary is internal and speed / typing matter more than reach.',
      },
      intro: "Almost everything modern software does across a network is an API call. Understanding HTTP semantics, the difference between an SDK and the raw API, and knowing when to reach for WebSocket vs Server-Sent Events vs plain polling will save you from a lot of avoidable pain. A well-designed API is <em>boring and predictable</em> — that is the compliment.\nBeyond REST there are alternatives with sharp trade-offs: <em>GraphQL</em> for client-shaped queries against a schema, <em>gRPC</em> for high-performance internal service-to-service, <em>SSE</em> and <em>WebSocket</em> for real-time. Pick the boring choice by default; reach for the alternatives when there’s a specific reason.",
      concepts: [
        ['REST', "An architectural style for HTTP APIs — resources at URLs, verbs by HTTP method, state in the response body. Not a spec, a set of conventions. Predictable, cacheable, tool-friendly. The default choice for public APIs and most internal ones."],
        ['HTTP methods & idempotency', "<em>GET</em>: read, safe, idempotent. <em>HEAD</em>: read headers only. <em>POST</em>: create; <em>not</em> idempotent. <em>PUT</em>: upsert, idempotent. <em>PATCH</em>: partial update. <em>DELETE</em>: idempotent. <em>OPTIONS</em>: CORS preflight. Idempotent = safe to retry on network error."],
        ['Status codes to know', "<strong>2xx</strong>: 200 OK, 201 Created, 204 No Content. <strong>3xx</strong>: 301 permanent redirect, 302 temporary, 304 Not Modified (cache hit). <strong>4xx</strong>: 400 Bad Request, 401 Unauthorized (not authenticated), 403 Forbidden (authenticated but not allowed), 404, 409 Conflict, 422 Unprocessable, 429 Too Many Requests. <strong>5xx</strong>: 500 Internal, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout."],
        ['Authentication schemes', "<em>Bearer token</em> (<code>Authorization: Bearer eyJ...</code>) — the modern default. <em>API key</em> in header or query — simple but coarse. <em>OAuth 2.0 / OIDC</em> — delegated auth for third-party apps. <em>mTLS</em> — machine-to-machine (cross-ref: [[tls]]). <em>Basic</em> — legacy, don’t use over unencrypted transports."],
        ['SDK vs API', "The <em>API</em> is the network contract (endpoints, params, response shapes). The <em>SDK</em> is a language-specific client library that wraps it — handles auth, retries, pagination, typed responses, telemetry. Prefer the SDK when one exists; call raw only when you need to."],
        ['Idempotency keys', "For non-idempotent methods (POST), let the client send a header like <code>Idempotency-Key: uuid</code>. Server caches the first result by that key; retries with the same key return the cached result. Standard in payment APIs (Stripe, PayPal); useful in any create endpoint that could be retried."],
        ['Pagination', "Cursor-based (return <code>next_cursor</code>) beats offset-based (<code>?page=5</code>) for large collections — stable under inserts, no “skipped/repeated rows” under concurrent writes. Return page metadata in headers or a wrapper object, not scattered."],
        ['Versioning', "URL-based (<code>/v1/</code>, <code>/v2/</code>) is the simplest and most visible. Header-based (<code>Accept: application/vnd.acme.v2+json</code>) is cleaner but harder to debug. Whichever you pick, commit to it — versioning half-heartedly is worse than not at all. Deprecate the old version publicly with a sunset header."],
        ['OpenAPI / Swagger', "A YAML/JSON schema describing your API — endpoints, params, responses, auth. Generates docs, client SDKs, mocks, and contract tests automatically. Design-first (write the spec, generate the code) is powerful; annotate-first (write code with decorators, generate spec) is common."],
        ['GraphQL', "One endpoint, a schema, and queries the client shapes. Great when many client teams need different subsets of the same data, or when over-fetching REST responses is a real cost. Costs: caching is harder, N+1 queries are easy to write, tooling and error paths are different."],
        ['gRPC', "HTTP/2 + Protocol Buffers. Fast, strictly typed, streams natively. The default for internal service-to-service in high-performance backends. Not browser-native (needs <code>grpc-web</code> proxy). Contracts in <code>.proto</code> files, code generated for every language."],
        ['Server-Sent Events (SSE)', "One-way HTTP stream, server → client. Server writes <code>text/event-stream</code> chunks (<code>data: ...\\n\\n</code>). Browser’s <code>EventSource</code> auto-reconnects. Perfect for LLM token streaming, notifications, live dashboards. Works through most proxies; needs no protocol upgrade."],
        ['WebSocket', "Two-way persistent connection over a single TCP socket, upgraded from HTTP. Use when the client also pushes frequently — chat, collaborative editors, games, live cursors. More complex than SSE; worth it only when true bidirectionality is needed."],
        ['CORS', "Browsers block cross-origin AJAX unless the server opts in via headers (<code>Access-Control-Allow-Origin</code>, etc.). Preflight OPTIONS request checks first. If you own the backend, allow-list your frontend origin; don’t <code>*</code> a browser-facing API that reads cookies."],
      ],
      code: "<span class=\"c\">// Server-Sent Events — one-way streaming from server to browser</span>\n\n<span class=\"c\">// Server (Express)</span>\napp.get(<span class=\"s\">'/stream'</span>, (req, res) =&gt; {\n  res.setHeader(<span class=\"s\">'Content-Type'</span>, <span class=\"s\">'text/event-stream'</span>);\n  res.setHeader(<span class=\"s\">'Cache-Control'</span>, <span class=\"s\">'no-cache'</span>);\n  res.setHeader(<span class=\"s\">'Connection'</span>, <span class=\"s\">'keep-alive'</span>);\n  <span class=\"k\">let</span> i = <span class=\"n\">0</span>;\n  <span class=\"k\">const</span> timer = setInterval(() =&gt; {\n    res.write(<span class=\"s\">'data: '</span> + JSON.stringify({ i: i++ }) + <span class=\"s\">'\\n\\n'</span>);\n  }, <span class=\"n\">1000</span>);\n  req.on(<span class=\"s\">'close'</span>, () =&gt; clearInterval(timer));\n});\n\n<span class=\"c\">// Browser</span>\n<span class=\"k\">const</span> events = <span class=\"k\">new</span> EventSource(<span class=\"s\">'/stream'</span>);\nevents.onmessage = (e) =&gt; {\n  <span class=\"k\">const</span> { i } = JSON.parse(e.data);\n  console.log(<span class=\"s\">'tick'</span>, i);\n};",
      codeCap: 'SSE reconnects automatically, works through most proxies, and needs no protocol upgrade. Reach for it before WebSocket unless you truly need two-way traffic.',
      quiz: [
        {
          q: 'Which of these HTTP methods should be idempotent by convention?',
          options: ['POST', 'GET, PUT, DELETE (safe or idempotent). POST is not.', 'Only DELETE', 'None of them'],
          correct: 1,
          why: 'Idempotency lets clients safely retry on network errors.',
        },
        {
          q: 'What is the difference between HTTP 401 and 403?',
          options: ['They are the same', '401 Unauthorized: you are not authenticated. 403 Forbidden: you are authenticated but not allowed to do this.', '401 is deprecated', '403 means server error'],
          correct: 1,
          why: 'A 401 usually invites the client to log in; a 403 tells them logging in more won’t help.',
        },
        {
          q: 'What is the difference between an API and an SDK?',
          options: ['No difference', 'The API is the network contract; the SDK is a language-specific client library that wraps it — auth, retries, pagination, typed responses', 'API is faster than SDK', 'Only SDKs support authentication'],
          correct: 1,
          why: 'Prefer the SDK when it exists; call the raw API only when it doesn’t or when you need something the SDK hides.',
        },
        {
          q: 'When would you prefer SSE over WebSocket?',
          options: ['When you need bidirectional real-time chat', 'When traffic is one-way (server → client) — SSE is simpler, works through more proxies, and reconnects automatically', 'Always', 'Never; WebSocket is always better'],
          correct: 1,
          why: 'LLM token streams are the canonical modern SSE use case.',
        },
        {
          q: 'A client is being rate-limited by your API. What status code should the server return?',
          options: ['500', '429 Too Many Requests', '404', '403'],
          correct: 1,
          why: 'Pair 429 with a Retry-After header so well-behaved clients know when to try again.',
        },
      ],
    },

    {
      id: 'mcp',
      part: 6,
      num: '30',
      title: 'MCP — Model Context Protocol',
      tag: 'A standard for giving LLM agents tools, resources, and prompts — the LSP moment for AI tool-use.',
      figure: {
        tag: 'Figure 1 · Client, protocol, servers',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="80" width="160" height="100" stroke="var(--accent)"/>
            <text x="100" y="104" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">MCP client</text>
            <text x="100" y="122" text-anchor="middle" font-size="9" stroke="none" class="fig-em">Claude Desktop</text>
            <text x="100" y="136" text-anchor="middle" font-size="9" stroke="none" class="fig-em">Claude Code · Cursor</text>
            <line x1="30" y1="146" x2="170" y2="146" opacity="0.4"/>
            <text x="100" y="164" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">discovers tools</text>
            <text x="100" y="176" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">surfaces to the model</text>
          </g>

          <g fill="currentColor">
            <path d="M 180 130 L 218 130" stroke="currentColor"/><polygon points="218,130 213,127 213,133"/>
          </g>
          <text x="199" y="122" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">JSON-RPC</text>
          <text x="199" y="152" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">stdio · HTTP</text>

          <g>
            <rect x="220" y="30" width="180" height="52"/>
            <text x="310" y="52" text-anchor="middle" font-size="10" font-weight="700" stroke="none">MCP server: github</text>
            <text x="310" y="68" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">list_prs · open_issue · comment</text>

            <rect x="220" y="100" width="180" height="52"/>
            <text x="310" y="122" text-anchor="middle" font-size="10" font-weight="700" stroke="none">MCP server: postgres</text>
            <text x="310" y="138" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">describe_table · run_query</text>

            <rect x="220" y="170" width="180" height="52"/>
            <text x="310" y="192" text-anchor="middle" font-size="10" font-weight="700" stroke="none">MCP server: your app</text>
            <text x="310" y="208" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">domain tools · resources · prompts</text>
          </g>

          <g fill="currentColor">
            <path d="M 400 56 L 438 90" stroke="currentColor"/><polygon points="438,90 431,88 435,82"/>
            <path d="M 400 126 L 438 126" stroke="currentColor"/><polygon points="438,126 433,123 433,129"/>
            <path d="M 400 196 L 438 172" stroke="currentColor"/><polygon points="438,172 431,174 434,168"/>
          </g>

          <g>
            <rect x="440" y="80" width="160" height="100"/>
            <text x="520" y="104" text-anchor="middle" font-size="12" font-weight="700" stroke="none">the model</text>
            <text x="520" y="122" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">"call postgres.describe_table"</text>
            <text x="520" y="138" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">"call github.open_issue"</text>
            <text x="520" y="160" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">picks tools by name</text>
          </g>
        </svg>`,
        caption: 'The client speaks JSON-RPC to any number of servers over stdio or streamable HTTP. Each server declares tools, resources, and prompts; the client surfaces them to the model. Implement one server for your service — every MCP-aware client can use it. LSP for LLM tools.',
      },
      intro: "The <em>Model Context Protocol</em> (MCP) is an open standard, driven originally by Anthropic and now supported broadly, for connecting LLM applications to external tools and data. It defines a client-server protocol: an MCP <em>server</em> exposes tools (things the model can invoke), resources (things the model can read), and prompts (reusable prompt templates), and an MCP <em>client</em> (Claude Desktop, Claude Code, Cursor, Zed, plus a growing list of IDEs and agent frameworks) discovers and uses them.\nBefore MCP, every agent-tool integration was one-off. MCP does for LLM tool-use what LSP did for editor language support: implement the server once, every client benefits. If you build backend systems that AI agents might interact with — CI, ticketing, databases, monitoring, internal APIs — MCP is where that surface lives now.",
      concepts: [
        ['MCP', "The <em>Model Context Protocol</em> — an open spec for exposing tools, resources, and prompts to LLM clients over a standard interface. Transports: <em>stdio</em> (client launches server as a subprocess and speaks over pipes) or <em>streamable HTTP</em> (server runs as a web service, uses SSE for streaming)."],
        ['JSON-RPC 2.0', "The wire protocol. Method calls with typed params, ID-matched responses, notifications for one-way messages. Same shape as the Language Server Protocol — the deliberate design echo."],
        ['Server', "A program that speaks MCP and offers capabilities. Servers exist for: filesystems, git, Slack, Postgres, MySQL, Jira, GitHub, GitLab, Puppeteer/browsers, Kubernetes, Sentry, Notion, Google Drive — an ever-growing catalogue at <code>github.com/modelcontextprotocol/servers</code>."],
        ['Client', "The application that drives the model — Claude Desktop, Claude Code, Cursor, Zed, VS Code extensions, custom agent frameworks. The client launches (stdio) or connects to (HTTP) MCP servers, discovers their capabilities, and surfaces them to the model as available actions."],
        ['Tools', "Functions the model can <em>invoke</em> with typed parameters and get typed results back. Tool schemas are JSON Schema; the server describes what it exposes, the client presents them to the model, the model picks tools by name. The most-used surface of MCP."],
        ['Resources', "Read-only content the model can <em>reference</em> — files, database rows, wiki pages, log excerpts — addressed by URI. Not invoked; surfaced for context. A resource is “here is data, in scope” rather than “here is a function you may call.”"],
        ['Prompts', "Reusable prompt templates a server exposes, often with parameters. The client can offer them to the user as slash commands or menu items (<code>/summarise-pr &lt;id&gt;</code>). Useful for encoding domain-specific workflows once and letting every user of the server run them."],
        ['Capabilities & discovery', "On connection, client and server exchange <em>initialize</em> messages advertising what they support (tools, resources, prompts, roots, sampling). The client then lists tools/resources/prompts by name. Everything is dynamic — servers can announce new tools mid-session."],
        ['Sampling (server → model)', "MCP’s most interesting reverse capability: a server can ask <em>the client</em> to run a model call for it. Enables agent-in-the-loop tools that themselves reason. Not universally supported yet; a signal of where the protocol is heading."],
        ['Local vs remote servers', "Stdio servers are typically local processes launched per-session — fast, private, no network. Streamable HTTP servers run as long-lived services and can be shared across users, secured with OAuth. Both have their place; enterprise deployments increasingly use remote."],
        ['Auth for remote MCP', "OAuth 2.1 with the Dynamic Client Registration extension is the emerging standard. The client redirects the user to authenticate; the server issues a token that scopes what tools/resources the caller may access. Cross-ref: [[rbac]] — the same principals-and-permissions model applies."],
        ['Building a server', "Reference SDKs in TypeScript, Python, Rust, Go, C#, Java. Define a tool with a name, description, JSON Schema for params, and a handler. Register it, run the server. The community catalogue grows fast — search before writing."],
        ['Why it matters for DevOps', "As agentic tools mature, your CI, monitoring, ticketing, databases, and cloud APIs will all be things AI assistants operate. Exposing them via MCP servers — with proper auth, audit, and least-privilege — is how you bring that capability inside a security model instead of accepting one-off integrations."],
      ],
      code: "<span class=\"c\"># A minimal MCP server config for Claude Code (or Claude Desktop)</span>\n<span class=\"c\"># ~/.claude/mcp.json</span>\n{\n  <span class=\"k\">\"mcpServers\"</span>: {\n    <span class=\"k\">\"filesystem\"</span>: {\n      <span class=\"k\">\"command\"</span>: <span class=\"s\">\"npx\"</span>,\n      <span class=\"k\">\"args\"</span>: [<span class=\"s\">\"-y\"</span>, <span class=\"s\">\"@modelcontextprotocol/server-filesystem\"</span>, <span class=\"s\">\"/Users/you/notes\"</span>]\n    },\n    <span class=\"k\">\"github\"</span>: {\n      <span class=\"k\">\"command\"</span>: <span class=\"s\">\"npx\"</span>,\n      <span class=\"k\">\"args\"</span>: [<span class=\"s\">\"-y\"</span>, <span class=\"s\">\"@modelcontextprotocol/server-github\"</span>],\n      <span class=\"k\">\"env\"</span>: { <span class=\"k\">\"GITHUB_TOKEN\"</span>: <span class=\"s\">\"ghp_...\"</span> }\n    }\n  }\n}",
      codeCap: 'Two servers registered. The client launches them, discovers their tools, and lets the model call them by name.',
      quiz: [
        {
          q: 'What is the Model Context Protocol (MCP)?',
          options: ['A cloud service run by Anthropic', 'An open standard for connecting LLM applications to external tools, resources, and prompts via a client-server protocol', 'A prompt engineering framework', 'A specific model architecture'],
          correct: 1,
          why: 'Standardises what used to be one-off integrations.',
        },
        {
          q: 'In MCP, what does a server expose?',
          options: ['Only tools', 'Tools (invokable functions), resources (readable content), and prompts (reusable templates)', 'Only chat messages', 'A REST API'],
          correct: 1,
          why: 'Three surfaces, each serving a different purpose in the model’s context.',
        },
        {
          q: 'Who plays the client role in MCP?',
          options: ['The MCP server itself', 'The LLM application — Claude Desktop, Claude Code, IDE plugins — that connects to servers and surfaces their capabilities to the model', 'The end user’s browser', 'The database'],
          correct: 1,
          why: 'The client bridges the model and the servers.',
        },
        {
          q: 'What is the difference between an MCP tool and an MCP resource?',
          options: ['They are the same', 'Tools are invoked with parameters and return results; resources are read-only content addressed by URI, made available for context', 'Tools are files; resources are functions', 'Resources are only for prompts'],
          correct: 1,
          why: 'Invoke a tool; reference a resource.',
        },
        {
          q: 'What was the practical problem MCP was designed to solve?',
          options: ['Model training cost', 'Every LLM tool integration being ad-hoc — one implementation per client × per tool. MCP lets one server serve many clients (and vice versa).', 'Model context windows being too small', 'The lack of a standard chat UI'],
          correct: 1,
          why: 'The LSP analogy: implement the language server once, every editor benefits.',
        },
      ],
    },

    {
      id: 'service-mesh',
      part: 2,
      num: '14',
      title: 'Service Mesh',
      tag: 'A dedicated layer for service-to-service concerns — mTLS, retries, canaries, telemetry — moved out of your app.',
      figure: {
        tag: 'Figure 1 · The sidecar pattern',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="40" y="80" width="220" height="120" stroke-dasharray="3 4"/>
            <text x="150" y="70" text-anchor="middle" font-size="10" font-weight="700" stroke="none" class="fig-muted">Pod A</text>
            <rect x="60" y="100" width="80" height="80"/>
            <text x="100" y="130" text-anchor="middle" font-size="11" font-weight="700" stroke="none">app</text>
            <text x="100" y="148" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">business logic</text>
            <text x="100" y="164" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">plain HTTP</text>

            <rect x="160" y="100" width="80" height="80" stroke="var(--accent)"/>
            <text x="200" y="130" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">sidecar</text>
            <text x="200" y="148" text-anchor="middle" font-size="9" stroke="none" class="fig-em">Envoy</text>
            <text x="200" y="164" text-anchor="middle" font-size="9" stroke="none" class="fig-em">mTLS, retry, trace</text>

            <line x1="140" y1="140" x2="160" y2="140" stroke="currentColor"/>
          </g>

          <g>
            <rect x="360" y="80" width="220" height="120" stroke-dasharray="3 4"/>
            <text x="470" y="70" text-anchor="middle" font-size="10" font-weight="700" stroke="none" class="fig-muted">Pod B</text>
            <rect x="380" y="100" width="80" height="80" stroke="var(--accent)"/>
            <text x="420" y="130" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">sidecar</text>
            <text x="420" y="148" text-anchor="middle" font-size="9" stroke="none" class="fig-em">Envoy</text>
            <text x="420" y="164" text-anchor="middle" font-size="9" stroke="none" class="fig-em">mTLS, retry, trace</text>

            <rect x="480" y="100" width="80" height="80"/>
            <text x="520" y="130" text-anchor="middle" font-size="11" font-weight="700" stroke="none">app</text>
            <text x="520" y="148" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">business logic</text>
            <text x="520" y="164" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">plain HTTP</text>

            <line x1="460" y1="140" x2="480" y2="140" stroke="currentColor"/>
          </g>

          <g stroke="var(--accent)" stroke-width="2" fill="none">
            <path d="M 240 140 L 380 140"/>
            <text x="310" y="132" text-anchor="middle" font-size="10" stroke="none" fill="var(--accent)" font-weight="700">mTLS · retry · timeout</text>
            <text x="310" y="156" text-anchor="middle" font-size="9" stroke="none" fill="var(--accent)">controlled by mesh CRDs, not app code</text>
          </g>

          <text x="40" y="230" font-size="10" stroke="none" class="fig-muted">The apps talk to localhost. Everything else is the sidecar's job.</text>
        </svg>`,
        caption: 'A sidecar proxy is deployed in every Pod, sharing the network namespace with the app. The app calls localhost; the proxy handles the real network hop — encrypted, retried, timed out, traced. All cross-cutting concerns move out of code and into declarative mesh policy.',
      },
      intro: "A service mesh is infrastructure that handles the cross-cutting concerns every service in a distributed system has to solve: mutual TLS between services, retries, timeouts, circuit breaking, load balancing, traffic splitting for canaries, and per-request telemetry. It does this by injecting a proxy (a <em>sidecar</em>) beside each application pod, transparently intercepting all traffic in and out. Your application code stays boring — no retry logic, no cert rotation, no distributed-tracing plumbing — and every service in the cluster gets the same treatment.\nIstio and Linkerd are the mainstream implementations on Kubernetes; Consul is another. Cilium (an eBPF-based CNI) is increasingly used as a mesh replacement, doing the same job in the kernel without sidecars. You don’t need a mesh on day one — you probably need one when hand-rolled retries, per-service TLS, and cross-service telemetry start feeling like a full-time job.",
      concepts: [
        ['Sidecar pattern', "A helper container running alongside your application container in the same Pod, sharing its network namespace. In a mesh, the sidecar is the mesh <em>data-plane proxy</em> (almost always <em>Envoy</em>) that transparently intercepts all in/out traffic via iptables rewriting."],
        ['Data plane vs control plane', "<em>Data plane</em>: the sidecar proxies handling actual traffic. <em>Control plane</em>: the mesh brain (<code>istiod</code>, Linkerd controller) that configures the proxies, mints and distributes certificates, and aggregates telemetry. You declare intent as CRDs; the control plane pushes config to the data plane."],
        ['mTLS by default', "The mesh mints a certificate per service identity (a Kubernetes ServiceAccount, effectively) and requires mutual TLS between all sidecars. Every inter-service call is authenticated and encrypted — without touching a line of application code. Rotation is automatic (short-lived certs, often 24h)."],
        ['Authorization policies', "Once every service has an identity, you can write policy in terms of identities. Istio <code>AuthorizationPolicy</code>: “only <em>orders</em> may call <em>payments</em>, only via POST /charge.” This is zero-trust networking at Layer 7, replacing IP-based rules."],
        ['Traffic policies (retries, timeouts, circuit breakers)', "<em>Retries</em>: automatic retry on 5xx or connection failure. <em>Timeouts</em>: per-request cap. <em>Circuit breakers</em>: stop calling a backend that’s failing so you don’t make it worse. Declared as CRDs (Istio <code>VirtualService</code>/<code>DestinationRule</code>, or the newer Gateway API <code>HTTPRoute</code>)."],
        ['Traffic shifting: canary & mirror', "<em>Weighted split</em>: 90% to v1, 10% to v2, adjustable in seconds. <em>Header-based routing</em>: route requests with header <code>x-canary: true</code> to v2. <em>Mirroring</em>: send v1 the response but also send a copy to v2 for observation (no side effects — v2’s response is discarded)."],
        ['Golden telemetry — for free', "Because every request passes through a sidecar, the mesh emits uniform metrics (RPS, error rate, latency percentiles per source→dest pair), access logs, and distributed traces across every service. Grafana + Prometheus + Jaeger dashboards ship pre-built in Istio/Linkerd."],
        ['Gateway API vs mesh CRDs', "The Kubernetes SIG-Network Gateway API (<code>HTTPRoute</code>, <code>Gateway</code>, <code>GRPCRoute</code>, <code>TCPRoute</code>) is the emerging vendor-neutral way to declare traffic. Istio and Linkerd both support it now; over time it replaces Istio’s own VirtualService/Gateway CRDs."],
        ['Ambient / sidecar-less meshes', "The frontier. Istio’s <em>Ambient mode</em>: replaces per-pod sidecars with node-level and namespace-level proxies. Cilium Service Mesh: uses eBPF in the kernel instead of userspace proxies. Both remove the per-pod memory tax that made classic meshes expensive."],
        ['Linkerd vs Istio', "Linkerd: opinionated, minimal, easy to install, uses its own tiny Rust proxy (<code>linkerd2-proxy</code>) instead of Envoy. Istio: more features, more knobs, more operational surface. Small teams often pick Linkerd; teams that need extensive traffic policy pick Istio."],
        ['Cost of a mesh', "A sidecar per pod is real: ~50–150MB memory per pod, an extra hop per request (usually <1ms), a control plane to operate. Meshes shine at scale; overkill for two microservices. Ambient/eBPF meshes are narrowing the cost gap."],
      ],
      code: "<span class=\"c\"># Istio VirtualService — 90/10 canary between two versions</span>\n<span class=\"k\">apiVersion</span>: networking.istio.io/v1beta1\n<span class=\"k\">kind</span>: VirtualService\n<span class=\"k\">metadata</span>: { <span class=\"k\">name</span>: <span class=\"s\">api</span> }\n<span class=\"k\">spec</span>:\n  <span class=\"k\">hosts</span>: [<span class=\"s\">api</span>]\n  <span class=\"k\">http</span>:\n    - <span class=\"k\">route</span>:\n        - <span class=\"k\">destination</span>: { <span class=\"k\">host</span>: <span class=\"s\">api</span>, <span class=\"k\">subset</span>: <span class=\"s\">v1</span> }\n          <span class=\"k\">weight</span>: <span class=\"n\">90</span>\n        - <span class=\"k\">destination</span>: { <span class=\"k\">host</span>: <span class=\"s\">api</span>, <span class=\"k\">subset</span>: <span class=\"s\">v2</span> }\n          <span class=\"k\">weight</span>: <span class=\"n\">10</span>\n      <span class=\"k\">retries</span>:\n        <span class=\"k\">attempts</span>: <span class=\"n\">3</span>\n        <span class=\"k\">perTryTimeout</span>: <span class=\"s\">2s</span>\n        <span class=\"k\">retryOn</span>: <span class=\"s\">5xx,connect-failure</span>",
      codeCap: 'A canary and a retry policy — declared once, applied to every request between sidecars. The app never learns retries.',
      quiz: [
        {
          q: 'What is a sidecar in a service mesh?',
          options: ['A backup service', 'A helper container running alongside the app in the same Pod, intercepting all traffic in and out', 'A separate cluster', 'A CI/CD component'],
          correct: 1,
          why: 'Envoy is the near-universal choice of sidecar proxy.',
        },
        {
          q: 'What is the difference between the data plane and the control plane?',
          options: ['They are the same', 'Data plane: the sidecar proxies actually moving traffic. Control plane: the brain that configures them, distributes certs, and aggregates telemetry', 'Data plane is deprecated', 'Control plane sees no traffic — right — but data plane is only for storage'],
          correct: 1,
          why: 'Istiod is Istio\'s control plane; Envoy sidecars are the data plane.',
        },
        {
          q: 'What does the mesh give you "for free" once installed?',
          options: ['Application logic', 'mTLS between services, uniform metrics and traces, and traffic policies (retries, timeouts, canaries) — all outside the app', 'A database', 'A CI/CD pipeline'],
          correct: 1,
          why: 'That\'s the pitch: cross-cutting concerns handled once, applied everywhere.',
        },
        {
          q: 'Why might a service mesh be overkill for a small system?',
          options: ['It always makes services faster', 'Each sidecar adds memory, latency, and operational overhead — worth it at scale, cost-heavy for two or three services', 'It cannot run on Kubernetes', 'It requires a paid license'],
          correct: 1,
          why: 'Reach for a mesh when the pain of hand-rolled retries, auth, and telemetry becomes real.',
        },
        {
          q: 'How would you canary a new version with a service mesh?',
          options: ['Blue-green deploy manually', 'Declare a traffic split — e.g., send 10% to v2 and 90% to v1 — and adjust weights over time as you gain confidence', 'Restart the whole cluster', 'You cannot canary with a mesh'],
          correct: 1,
          why: 'Weighted splits + observability on each subset is the whole reason mesh canaries feel safe.',
        },
      ],
    },

    {
      id: 'queues',
      part: 4,
      num: '20',
      title: 'Message Queues & Event Streaming',
      tag: 'Loose-coupling services — buffer the spikes, absorb failures, unlock async work — queues, topics, streams, deliveries, offsets.',
      figure: {
        tag: 'Figure 1 · Producer · Broker · Consumers',
        svg: `<svg class="figure-svg" viewBox="0 0 620 240" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="100" width="120" height="50"/>
            <text x="80" y="122" text-anchor="middle" font-size="11" font-weight="700" stroke="none">producer</text>
            <text x="80" y="138" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">orders svc</text>
          </g>
          <path d="M 140 125 L 178 125" stroke="currentColor"/><polygon points="178,125 173,122 173,128" fill="currentColor"/>
          <text x="160" y="115" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">publish</text>

          <g>
            <rect x="180" y="60" width="200" height="140" stroke="var(--accent)"/>
            <text x="280" y="82" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">broker</text>
            <text x="280" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-em">Kafka / RabbitMQ / SQS</text>
            <g>
              <rect x="200" y="110" width="160" height="18"/>
              <rect x="200" y="130" width="160" height="18"/>
              <rect x="200" y="150" width="160" height="18"/>
              <rect x="200" y="170" width="160" height="18"/>
              <text x="210" y="123" font-size="9" stroke="none" class="fig-muted">msg 4 · newest</text>
              <text x="210" y="143" font-size="9" stroke="none" class="fig-muted">msg 3</text>
              <text x="210" y="163" font-size="9" stroke="none" class="fig-muted">msg 2</text>
              <text x="210" y="183" font-size="9" stroke="none" class="fig-muted">msg 1 · oldest</text>
            </g>
          </g>

          <path d="M 380 100 L 418 60" stroke="currentColor"/><polygon points="418,60 410,60 414,66" fill="currentColor"/>
          <path d="M 380 130 L 418 130" stroke="currentColor"/><polygon points="418,130 413,127 413,133" fill="currentColor"/>
          <path d="M 380 160 L 418 200" stroke="currentColor"/><polygon points="418,200 410,200 414,194" fill="currentColor"/>

          <g>
            <rect x="420" y="35" width="180" height="50"/>
            <text x="510" y="57" text-anchor="middle" font-size="10" font-weight="700" stroke="none">consumer A</text>
            <text x="510" y="73" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">bill: fulfil</text>

            <rect x="420" y="105" width="180" height="50"/>
            <text x="510" y="127" text-anchor="middle" font-size="10" font-weight="700" stroke="none">consumer B</text>
            <text x="510" y="143" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">warehouse: pack</text>

            <rect x="420" y="175" width="180" height="50"/>
            <text x="510" y="197" text-anchor="middle" font-size="10" font-weight="700" stroke="none">consumer C</text>
            <text x="510" y="213" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">analytics: log</text>
          </g>
        </svg>`,
        caption: 'The producer publishes, the broker holds, the consumers pull independently. Producer never knows who reads. Consumers can be added, restarted, catch up — the broker buffers what they miss. That decoupling is what queues sell.',
      },
      intro: "Once your system has more than one service, sooner or later you need one to hand work to another <em>without blocking</em> on it. A message queue or event stream sits between them: the producer publishes; the broker durably stores; the consumer pulls when ready. Slow consumer? The queue absorbs the difference. Consumer crashed? The queue keeps the messages until it comes back. Fan out to five consumers? They can all read the same events.\nThe two family lines: <em>queues</em> (RabbitMQ, Redis Streams, SQS, ActiveMQ) for task/job work with per-message delivery; <em>event streams</em> (Kafka, Redpanda, Pulsar, Kinesis) as durable logs replayable by many consumers. Cloud managed: SQS (AWS), Pub/Sub (GCP), Service Bus + Event Hubs (Azure), MSK/Confluent Cloud (managed Kafka).",
      concepts: [
        ['Producer / Consumer / Broker', "The three roles. <em>Producer</em> publishes; <em>Broker</em> durably stores and routes; <em>Consumer</em> reads. Neither producer nor consumer knows how many of the other exist. Add more consumers to scale processing (up to the partition/queue limit)."],
        ['Queue vs Topic', "<em>Queue</em>: each message is delivered to exactly <em>one</em> consumer in the pool (classic work distribution — RabbitMQ, SQS). <em>Topic / pub-sub</em>: every subscriber gets every message (fan-out — Kafka, NATS, Pub/Sub). Kafka topics blend both: a topic is a partitioned log; consumers within one <em>consumer group</em> share the work, but different groups each get the full stream."],
        ['Delivery guarantees', "<em>At-most-once</em>: possibly lost, never duplicated (rare). <em>At-least-once</em>: the default — one or more deliveries; consumer must be idempotent. <em>Exactly-once</em>: guaranteed via producer transactions + idempotent consumers (Kafka Transactions, RabbitMQ streams). Assume at-least-once until proved otherwise."],
        ['Idempotency', "Since the default is at-least-once, <code>process(msg)</code> called twice must equal called once. Techniques: idempotency keys (record processed IDs), upserts instead of inserts, natural keys, dedup windows."],
        ['Acks & redelivery', "Consumer <em>acks</em> a message after successful processing; broker deletes/advances. Consumer crashes before ack → broker redelivers to another consumer. RabbitMQ <code>basic_ack</code>/<code>nack</code>; Kafka commits offsets."],
        ['Kafka: partitions, offsets, consumer groups', "A Kafka topic is a distributed log split into <em>partitions</em>. Each partition is ordered; the topic overall isn’t. Each partition assigned to exactly one consumer in a consumer group at a time — so parallelism per group is capped at partition count. Offsets are consumer-group-per-partition — where each group has read to."],
        ['Retention & replay', "Streams keep messages for a retention window (Kafka: often days/weeks). Any consumer can rewind and re-process. Queues typically delete after ack — replay isn’t a first-class operation. This is why event-sourced systems favour streams."],
        ['Ordering', "Kafka guarantees order <em>within a partition</em>. Choose your partition key so related messages land together (all orders for user X on the same partition). Cross-partition order is not preserved. Queues generally don’t guarantee cross-consumer order either."],
        ['Backpressure & queue depth', "When consumers can’t keep up, the queue grows. Alert on queue depth and consumer lag. Queues absorb bursts, not sustained overload — a growing queue means you either scale consumers, shed load, or reduce production rate."],
        ['Dead-letter queues', "A dedicated queue for messages that repeatedly fail processing. Rather than blocking the main queue forever, poison messages get parked with metadata (last error, delivery count) for investigation. Set redelivery limits (3–5) then DLQ."],
        ['Outbox pattern', "For reliable produce-alongside-write: the app writes both its business row and a row to an <em>outbox</em> table in the same DB transaction. A separate process publishes rows from the outbox to the broker. Avoids the classic bug where the DB commits but the message is lost."],
        ['Managed vs self-hosted', "Kafka is famously operationally heavy. Managed offerings (Confluent Cloud, MSK, Aiven, Redpanda Cloud) hand you a broker and let you focus on producers/consumers. SQS and Pub/Sub go further — no broker concept, just an API endpoint. Reach for managed unless you have real scale-cost pressure."],
      ],
      code: "<span class=\"c\"># RabbitMQ producer + consumer, Python (pika)</span>\n<span class=\"k\">import</span> pika, json, time\nconn = pika.BlockingConnection(pika.ConnectionParameters(<span class=\"s\">\"rabbit\"</span>))\nch   = conn.channel()\nch.queue_declare(<span class=\"k\">queue</span>=<span class=\"s\">\"jobs\"</span>, <span class=\"k\">durable</span>=<span class=\"n\">True</span>)\n\n<span class=\"c\"># producer</span>\nch.basic_publish(<span class=\"k\">exchange</span>=<span class=\"s\">\"\"</span>, <span class=\"k\">routing_key</span>=<span class=\"s\">\"jobs\"</span>,\n                 <span class=\"k\">body</span>=json.dumps({<span class=\"s\">\"userId\"</span>: <span class=\"n\">42</span>, <span class=\"s\">\"action\"</span>: <span class=\"s\">\"send-email\"</span>}),\n                 <span class=\"k\">properties</span>=pika.BasicProperties(<span class=\"k\">delivery_mode</span>=<span class=\"n\">2</span>))  <span class=\"c\"># persist to disk</span>\n\n<span class=\"c\"># consumer</span>\n<span class=\"k\">def</span> handle(ch, method, props, body):\n    job = json.loads(body)\n    do_work(job)\n    ch.basic_ack(<span class=\"k\">delivery_tag</span>=method.delivery_tag)  <span class=\"c\"># only ack after success</span>\n\nch.basic_qos(<span class=\"k\">prefetch_count</span>=<span class=\"n\">10</span>)  <span class=\"c\"># at most 10 unacked messages per worker</span>\nch.basic_consume(<span class=\"k\">queue</span>=<span class=\"s\">\"jobs\"</span>, <span class=\"k\">on_message_callback</span>=handle)\nch.start_consuming()",
      codeCap: 'Persistent messages, manual ack after success, bounded prefetch. That triple is what makes RabbitMQ actually reliable.',
      quiz: [
        {
          q: 'What is the essential value of a message queue between two services?',
          options: ['It always makes requests faster', 'It decouples producer and consumer, absorbs bursts, and survives crashes on either side', 'It replaces the database', 'It enables synchronous RPC'],
          correct: 1,
          why: 'When the consumer is slow or gone, the queue holds the work until it recovers.',
        },
        {
          q: 'What does "at-least-once delivery" mean for a consumer?',
          options: ['Each message is delivered exactly once', 'A message will be delivered one or more times — so consumers must be idempotent', 'A message may be lost', 'It is a paid feature'],
          correct: 1,
          why: 'Design work handlers so process(msg) twice equals process(msg) once. Idempotency keys help.',
        },
        {
          q: 'What is a dead-letter queue?',
          options: ['A queue that has been deleted', 'A parking place for messages that repeatedly fail processing, so the main queue is not blocked', 'A backup of every queue', 'A deprecated queue type'],
          correct: 1,
          why: 'Investigate the DLQ periodically; it usually reveals a real bug or a poison payload.',
        },
        {
          q: 'What is the parallelism unit of a Kafka topic?',
          options: ['The consumer', 'The partition — a topic is split into partitions, and each consumer in a group reads a subset', 'The message', 'The broker'],
          correct: 1,
          why: 'You can\'t have more parallel consumers in a group than a topic has partitions.',
        },
        {
          q: 'Your queue depth is climbing and consumers are falling behind. First response?',
          options: ['Delete the queue', 'Understand why: scale consumers, shed non-critical work, look at consumer latency and error rate — a growing queue means production is outpacing consumption', 'Increase message size', 'Turn off the producer permanently'],
          correct: 1,
          why: 'A queue absorbs bursts, not steady overload. Growing depth is a signal to act.',
        },
      ],
    },

    {
      id: 'caching',
      part: 4,
      num: '21',
      title: 'Caching & CDNs',
      tag: 'Serving the same answer twice is expensive — cache it once, close to the user; the hard part is invalidating it.',
      figure: {
        tag: 'Figure 1 · Cache hierarchy — five chances to skip work',
        svg: `<svg class="figure-svg" viewBox="0 0 620 220" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20"  y="80" width="90" height="60"/>
            <text x="65" y="102" text-anchor="middle" font-size="11" font-weight="700" stroke="none">browser</text>
            <text x="65" y="118" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">disk + memory</text>

            <rect x="140" y="80" width="90" height="60"/>
            <text x="185" y="102" text-anchor="middle" font-size="11" font-weight="700" stroke="none">CDN edge</text>
            <text x="185" y="118" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">Cloudflare · Fastly</text>

            <rect x="260" y="80" width="90" height="60"/>
            <text x="305" y="102" text-anchor="middle" font-size="11" font-weight="700" stroke="none">reverse</text>
            <text x="305" y="116" text-anchor="middle" font-size="11" font-weight="700" stroke="none">proxy</text>
            <text x="305" y="132" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">nginx · varnish</text>

            <rect x="380" y="80" width="90" height="60"/>
            <text x="425" y="102" text-anchor="middle" font-size="11" font-weight="700" stroke="none">app cache</text>
            <text x="425" y="118" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">Redis · Memcached</text>

            <rect x="500" y="80" width="100" height="60" stroke="var(--accent)"/>
            <text x="550" y="102" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">database</text>
            <text x="550" y="118" text-anchor="middle" font-size="9" stroke="none" class="fig-em">last resort</text>
          </g>
          <g fill="currentColor">
            <path d="M 110 110 L 138 110" stroke="currentColor"/><polygon points="138,110 133,107 133,113"/>
            <path d="M 230 110 L 258 110" stroke="currentColor"/><polygon points="258,110 253,107 253,113"/>
            <path d="M 350 110 L 378 110" stroke="currentColor"/><polygon points="378,110 373,107 373,113"/>
            <path d="M 470 110 L 498 110" stroke="currentColor"/><polygon points="498,110 493,107 493,113"/>
          </g>
          <text x="20" y="180" font-size="9" stroke="none" class="fig-muted">each layer catches a wider audience with a longer invalidation cycle</text>
          <text x="20" y="196" font-size="9" stroke="none" class="fig-muted">"Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=30"</text>
        </svg>`,
        caption: 'The request tries every layer left-to-right; the first hit wins. Browser is a cache of one; CDN is a cache of millions; app cache is a cache of your fleet. The hard part isn\'t populating them — it\'s telling all of them, correctly, when the answer has changed.',
      },
      intro: "Almost every performance problem in a mature system is solvable with the right cache in the right place. HTTP caching at the browser, edge caching at the CDN, application caching in Redis or Memcached, query caching in the database — each layer catches a different kind of repeat work, at a different cost, with a different invalidation cycle.\nThe hard part of caching isn’t writing to the cache. It’s <em>invalidating</em> it — knowing when the cached answer is stale, and telling every layer that holds a copy. The Phil Karlton joke: there are two hard things in CS — cache invalidation, and naming things. This chapter covers the practical patterns for both sides: caching what should be cached, and blowing it away cleanly when it’s wrong.",
      concepts: [
        ['Cache hierarchy', "Browser → CDN edge → reverse-proxy cache → application cache (Redis/Memcached) → database (query planner cache, buffer pool). Each layer catches a wider audience but has a longer invalidation cycle. Cache <em>as high as you can</em> get away with — CDN reaches millions with one hit."],
        ['CDN — content delivery network', "A global fleet of edge servers (<em>Cloudflare</em>, <em>CloudFront</em>, <em>Fastly</em>, <em>Akamai</em>, <em>Bunny</em>). Cache your responses close to the user, offloading origin. Essential for static assets; increasingly used for API responses, HTML, and even dynamic content via edge compute."],
        ['HTTP cache — Cache-Control', "HTTP’s built-in cache language. <code>Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=60</code>. <em>max-age</em>: browser TTL. <em>s-maxage</em>: shared cache TTL (overrides). <em>public</em>/<em>private</em>: cacheable by shared caches or only by the client. <em>no-store</em>: don’t cache at all. Learn it and CDNs do what you want."],
        ['ETag & Last-Modified', "Conditional requests. Server returns <code>ETag: \"abc\"</code>; next request sends <code>If-None-Match: \"abc\"</code>; server replies 304 Not Modified with an empty body. Saves bandwidth even when the client-side TTL has expired."],
        ['stale-while-revalidate', "A cache directive letting caches serve a <em>stale</em> response instantly while asynchronously fetching a fresh one. Hides revalidation latency from users. <code>Cache-Control: max-age=60, stale-while-revalidate=300</code>: fresh for 60s, may serve stale for another 300s while refreshing."],
        ['Redis', "The default modern in-memory data store. Rich data structures (strings, lists, sets, sorted sets, hashes, streams, hyperloglogs, geo, bitmaps), pub/sub, optional persistence (RDB snapshots + AOF log), replication, Sentinel/Cluster for HA. Used for cache, session store, rate limits, leaderboards, queues."],
        ['Memcached', "Pure in-memory key-value cache — no persistence, no data structures beyond flat strings. Dead simple, extremely fast, multi-threaded. Reach for it when you want a raw cache with no other features."],
        ['Cache pattern: read-through / cache-aside', "<em>Cache-aside</em>: app checks cache; miss → fetch from DB, populate cache, return. Most common. <em>Read-through</em>: cache library handles the miss itself. <em>Write-through</em>: writes go to cache and DB together. <em>Write-behind</em>: writes go to cache; async persistence — fast but risky."],
        ['Invalidation strategies', "<em>TTL only</em>: simple, accepts some staleness. <em>Event-driven purge</em>: on write, delete or update the cached key (works well with cache-aside). <em>Versioned URLs</em>: <code>/static/app-abc123.js</code> — new build, new hash, new URL; old cached copies are simply never asked for again. <em>Cache tags</em>: attach tags to entries, purge by tag (Cloudflare, Varnish)."],
        ['Cache stampede & thundering herd', "When a hot key expires, N requests all miss simultaneously and hammer the DB. Mitigations: <em>single-flight</em> (only one recomputes; the rest wait), <em>probabilistic early expiration</em>, <em>request coalescing</em> at the cache/CDN layer."],
        ['Negative caching', "Cache the absence too — “user 12345 does not exist” — so a repeated bad lookup doesn’t hit the DB every time. Short TTL, but distinct from a positive cache miss."],
        ['CDN cache-key normalisation', "Two identical URLs with different query strings or headers may cache as different entries. Configure the CDN to normalise (drop marketing params, ignore certain headers) so hit rates aren’t destroyed by trivial variation."],
      ],
      code: "<span class=\"c\"># The classic read-through cache pattern in an app</span>\n<span class=\"k\">def</span> get_user(id):\n    key = <span class=\"s\">f\"user:{id}\"</span>\n    cached = redis.get(key)\n    <span class=\"k\">if</span> cached:\n        <span class=\"k\">return</span> json.loads(cached)\n    user = db.fetch_user(id)\n    redis.setex(key, <span class=\"n\">300</span>, json.dumps(user))  <span class=\"c\"># 5-minute TTL</span>\n    <span class=\"k\">return</span> user\n\n<span class=\"c\"># On update, invalidate</span>\n<span class=\"k\">def</span> update_user(id, changes):\n    db.update_user(id, changes)\n    redis.delete(<span class=\"s\">f\"user:{id}\"</span>)\n\n<span class=\"c\"># HTTP caching hint for a public API endpoint</span>\n<span class=\"c\"># Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=30</span>\n<span class=\"c\">#   browsers: 60s   CDN: 5 min   after expiry: serve stale for 30s while refreshing</span>",
      codeCap: 'Read-through with a short TTL and explicit invalidation on write. Good default for most read-heavy entities.',
      quiz: [
        {
          q: 'What does a CDN do?',
          options: ['Runs your database', 'Caches your responses on a global network of edge servers close to end users — reducing latency and origin load', 'Compiles code', 'Is a monitoring service'],
          correct: 1,
          why: 'Static assets are the obvious use case; API and HTML edge caching are the modern uses.',
        },
        {
          q: 'What is the difference between Redis and Memcached?',
          options: ['They are the same', 'Memcached is pure key-value in memory; Redis adds rich data structures, persistence, pub/sub — the default modern choice', 'Redis is deprecated', 'Memcached is only for images'],
          correct: 1,
          why: 'You reach for Redis almost every time; Memcached is niche now.',
        },
        {
          q: 'What is the "hard problem" of caching?',
          options: ['Reading from the cache', 'Cache invalidation — knowing when the cached value is stale and doing something about it', 'Choosing a cache library', 'Storing values'],
          correct: 1,
          why: 'The Phil Karlton joke: two hard things in CS are cache invalidation and naming things.',
        },
        {
          q: 'What does <code>Cache-Control: max-age=60, s-maxage=300</code> mean?',
          options: ['Do not cache anywhere', 'Browsers may cache for 60 seconds; shared caches (CDN, proxies) may cache for 300 seconds', 'The same thing twice', 'It is invalid syntax'],
          correct: 1,
          why: 's-maxage overrides max-age for shared caches, letting you tune browser and CDN separately.',
        },
        {
          q: 'What is <code>stale-while-revalidate</code>?',
          options: ['A bug in HTTP', 'A directive letting caches serve a stale response while asynchronously fetching a fresh one — hides revalidation latency from users', 'Only works with WebSockets', 'A Redis-only feature'],
          correct: 1,
          why: 'Great for pages that update occasionally but need snappy loads.',
        },
      ],
    },

    {
      id: 'secrets',
      part: 4,
      num: '22',
      title: 'Secrets Management',
      tag: 'Where API keys, DB passwords, and certificates actually belong — encrypted, audited, rotated, delivered at run time.',
      figure: {
        tag: 'Figure 1 · Dynamic secrets — no static credential exists',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="100" width="130" height="60"/>
            <text x="85" y="122" text-anchor="middle" font-size="11" font-weight="700" stroke="none">app pod</text>
            <text x="85" y="138" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">SA · k8s auth</text>
          </g>
          <path d="M 150 130 L 188 130" stroke="currentColor"/><polygon points="188,130 183,127 183,133" fill="currentColor"/>
          <text x="169" y="118" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">login</text>

          <g>
            <rect x="190" y="60" width="180" height="140" stroke="var(--accent)"/>
            <text x="280" y="82" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">Vault</text>
            <text x="280" y="98" text-anchor="middle" font-size="9" stroke="none" class="fig-em">policy: db-readonly</text>
            <line x1="210" y1="110" x2="350" y2="110" stroke-dasharray="2 3" opacity="0.4"/>
            <text x="280" y="130" text-anchor="middle" font-size="10" stroke="none">1. verify SA token</text>
            <text x="280" y="146" text-anchor="middle" font-size="10" stroke="none">2. create fresh DB user</text>
            <text x="280" y="162" text-anchor="middle" font-size="10" stroke="none">3. return creds + lease</text>
            <text x="280" y="184" text-anchor="middle" font-size="10" stroke="none">4. revoke on expiry</text>
          </g>

          <path d="M 370 100 L 408 60" stroke="currentColor"/><polygon points="408,60 400,60 404,66" fill="currentColor"/>
          <text x="390" y="52" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">CREATE USER v-app-abc123 …</text>

          <g>
            <rect x="410" y="30" width="180" height="60"/>
            <text x="500" y="52" text-anchor="middle" font-size="11" font-weight="700" stroke="none">Postgres</text>
            <text x="500" y="68" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">short-lived user</text>
          </g>

          <path d="M 370 160 L 408 200" stroke="currentColor" stroke-dasharray="3 3" opacity="0.6"/>
          <text x="390" y="192" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">DROP USER at lease end</text>

          <text x="20" y="222" font-size="9" font-weight="700" letter-spacing="0.14em" stroke="none" class="fig-muted">NO STATIC DB PASSWORD EXISTS ANYWHERE — LEASE-BOUND, PER-CALLER, AUDITED</text>
        </svg>`,
        caption: 'Vault mints a fresh DB user for each app pod on demand, hands over its lease, and revokes the user when the lease expires. Nothing static to leak, nothing long-lived to rotate — a compromised credential dies on its own within the hour.',
      },
      intro: "Secrets — API tokens, database passwords, TLS keys, cloud credentials, JWT signing keys — never belong in git, in Docker images, in <code>.env</code> files checked into repos, or in plaintext on shared filesystems. A proper secrets manager stores them encrypted at rest, gates access with fine-grained policies, audits every read, and rotates them on a schedule.\nThe canonical open-source choice is <em>HashiCorp Vault</em>. Every major cloud has an equivalent: AWS Secrets Manager, GCP Secret Manager, Azure Key Vault. For GitOps flows where you want the ciphertext committed to git, <em>Sealed Secrets</em> and <em>SOPS</em> are the tools. For Kubernetes specifically, <em>External Secrets Operator</em> and <em>CSI Secret Driver</em> pull secrets from external stores at pod-start.",
      concepts: [
        ['Secrets manager', "A service that stores secrets encrypted at rest, authenticates and authorises callers, audits every access, and (usually) rotates them. Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, Bitwarden Secrets Manager, Doppler, Infisical."],
        ['KMS & envelope encryption', "A <em>Key Management Service</em> holds master encryption keys in hardware (HSMs). Applications encrypt <em>data keys</em> with the master key — cheap operations at the KMS boundary, unlimited data encrypted client-side with the data key. All the above secret managers use envelope encryption internally."],
        ['Sealed Secrets', "A Kubernetes controller (from Bitnami) that encrypts a K8s Secret manifest with a public key, producing a <code>SealedSecret</code> ciphertext safe to commit to git. Only the in-cluster controller (with the private key) can decrypt at apply time, minting the real Secret. Perfect for GitOps."],
        ['SOPS', "Mozilla’s <em>Secrets OPerationS</em>. Encrypts values inside YAML/JSON/env files using KMS, GPG, or <em>age</em> keys. File structure stays readable; individual values become ciphertext blobs with tags. Popular with Flux, Helmfile, Terragrunt. <code>sops -e secrets.yaml &gt; secrets.enc.yaml</code>."],
        ['External Secrets Operator (ESO)', "A K8s controller that syncs from Vault/AWS Secrets Manager/GCP/Azure into native K8s Secrets. You declare <code>ExternalSecret</code> resources; ESO fetches, renders, and refreshes. Reduces the tension between “secret in K8s” and “secret in central store.”"],
        ['CSI Secret Driver', "Mounts secrets from an external store directly into a pod as a volume, without ever materialising a K8s Secret. Cleaner audit story for the highest-value secrets."],
        ['Dynamic secrets', "The Vault killer feature. On demand, Vault creates a <em>fresh, short-lived database user</em> for the caller with its own credentials. When the lease expires (say 1 hour), Vault revokes the user. No long-lived DB passwords ever exist. Same for cloud credentials (STS AssumeRole), SSH certificates, PKI."],
        ['Auth methods', "How principals authenticate to Vault. Static (token, username/password), or better: <em>AppRole</em> for services, <em>Kubernetes auth</em> (Vault verifies a K8s ServiceAccount token), <em>AWS IAM auth</em>, <em>OIDC/JWT</em> for humans. Human access via SSO; workload access via workload identity."],
        ['Rotation', "Rolling secrets on a schedule reduces exposure window. Vault rotates DB roots and cloud roles automatically. RDS/CloudSQL support in-place password rotation. cert-manager rotates TLS certs. A secret that never rotates is a secret waiting to leak — full-lifetime exposure to whoever gets a copy."],
        ['Least privilege for secrets', "Every secret path gets a policy: which principals may read it, from where, when. Grant per-secret (<code>secret/data/prod/postgres</code>), not blanket <code>secret/*</code>. Audit denials as well as allows — a spike of denials from one caller often precedes a real intrusion attempt."],
        ['Secret scanning', "GitHub, GitLab, TruffleHog, gitleaks scan your repos and PRs for accidentally-committed API keys, private keys, tokens. Enable them. When it fires, <em>rotate the secret first</em>, then remove from history; something scraping GitHub found it seconds after you pushed."],
        ['Never commit envs', "Even in dev, avoid committing real credentials. Templates yes (<code>.env.example</code>), real values in local <code>.env</code> ignored by git. Use direnv/mise/dotenv-vault so switching projects loads their secrets automatically."],
      ],
      code: "<span class=\"c\"># A sealed-secret in git — safe to commit</span>\n<span class=\"k\">apiVersion</span>: bitnami.com/v1alpha1\n<span class=\"k\">kind</span>: SealedSecret\n<span class=\"k\">metadata</span>:\n  <span class=\"k\">name</span>: <span class=\"s\">db-credentials</span>\n  <span class=\"k\">namespace</span>: <span class=\"s\">prod</span>\n<span class=\"k\">spec</span>:\n  <span class=\"k\">encryptedData</span>:\n    <span class=\"k\">password</span>: AgAKq2c4h... <span class=\"c\"># ciphertext; only the controller can decrypt</span>\n    <span class=\"k\">username</span>: AgBTf9r1n...\n\n<span class=\"c\"># Reading a secret from Vault at app startup (CLI style)</span>\n$ export VAULT_ADDR=https://vault.example.com\n$ export VAULT_TOKEN=$(cat /var/run/secrets/vault/token)\n$ vault kv get -field=password secret/data/prod/postgres\n<span class=\"n\">************</span>\n\n<span class=\"c\"># Dynamic DB credentials from Vault — short-lived, per-caller</span>\n$ vault read database/creds/app-readonly\nKey                Value\n---                -----\nlease_duration     1h\nusername           v-app-readonly-x9K...\npassword           <span class=\"n\">************</span>",
      codeCap: "Sealed-secrets for git-committable ciphertext. Vault for dynamic, short-lived credentials. Never a `.env` in production.",
      quiz: [
        {
          q: 'Why store secrets in a dedicated secrets manager rather than in a config file?',
          options: ['Because config files are slow', 'Encrypted at rest, per-caller authorisation, an audit log of every read, and an obvious place to rotate from — none of which a plaintext file gives you', 'It is legally required for all files', 'To make deployments harder'],
          correct: 1,
          why: 'Auditability alone is worth it — you can prove who accessed what and when.',
        },
        {
          q: 'What is a sealed-secret?',
          options: ['A regular K8s Secret that has been backed up', 'A Kubernetes resource holding ciphertext encrypted with a public key — safe to commit to git; only the in-cluster controller (with the matching private key) can decrypt', 'A deprecated secret type', 'A file with a padlock icon'],
          correct: 1,
          why: 'Bitnami Sealed Secrets is the reference implementation. Perfect fit for GitOps.',
        },
        {
          q: 'What does SOPS do?',
          options: ['Nothing, it is deprecated', 'Encrypts values inside a structured file (YAML/JSON/env) using KMS, GPG, or age keys — file structure stays readable, values become ciphertext', 'Backs up secrets to S3', 'Is a container runtime'],
          correct: 1,
          why: 'Great with Flux, Helmfile, and Terragrunt.',
        },
        {
          q: 'What is a "dynamic secret" in Vault?',
          options: ['A secret that changes randomly', 'A short-lived credential minted on demand for the caller — e.g., a fresh database user with a lease — revoked when the lease expires', 'A file that never expires', 'A public API key'],
          correct: 1,
          why: 'Reduces the blast radius when a credential is misused: it dies on its own quickly.',
        },
        {
          q: 'A secret that never rotates is…',
          options: ['Preferable — stability is best', 'A secret waiting to leak — every unrotated credential\'s exposure window is its full lifetime; automate rotation wherever possible', 'Encrypted twice for safety', 'Legally required'],
          correct: 1,
          why: 'Vault, cloud secret managers, and cert-manager all automate rotation for the resources they manage.',
        },
      ],
    },

    {
      id: 'bastion',
      part: 1,
      num: '09',
      title: 'Bastion & Jump Access',
      tag: 'How operators actually reach private infrastructure — from classic SSH bastions to modern zero-trust jump access.',
      figure: {
        tag: 'Figure 1 · Classic bastion vs zero-trust SSM',
        svg: `<svg class="figure-svg" viewBox="0 0 620 280" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <!-- Divider -->
          <line x1="310" y1="20" x2="310" y2="270" stroke-dasharray="4 4" opacity="0.5"/>
          <text x="150" y="38" text-anchor="middle" font-size="10" font-weight="700" stroke="none" class="fig-muted">CLASSIC BASTION</text>
          <text x="470" y="38" text-anchor="middle" font-size="10" font-weight="700" stroke="none" class="fig-em">IAM-AUTH TUNNEL (SSM / IAP)</text>

          <!-- LEFT: Bastion -->
          <g>
            <rect x="30" y="60" width="70" height="34"/>
            <text x="65" y="82" text-anchor="middle" font-size="10" stroke="none">laptop</text>
            <rect x="130" y="60" width="80" height="34"/>
            <text x="170" y="82" text-anchor="middle" font-size="10" font-weight="700" stroke="none">bastion</text>
            <text x="170" y="107" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">:22 exposed</text>
            <rect x="240" y="60" width="60" height="34"/>
            <text x="270" y="82" text-anchor="middle" font-size="10" stroke="none">target</text>

            <path d="M 100 77 L 128 77" stroke="currentColor"/><polygon points="128,77 122,74 122,80" fill="currentColor"/>
            <path d="M 210 77 L 238 77" stroke="currentColor"/><polygon points="238,77 232,74 232,80" fill="currentColor"/>

            <!-- Costs -->
            <text x="170" y="150" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">host to patch</text>
            <text x="170" y="164" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">keys on it forever</text>
            <text x="170" y="178" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">port 22 to internet</text>
            <text x="170" y="192" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">audit is a shell log</text>
          </g>

          <!-- RIGHT: SSM -->
          <g>
            <rect x="340" y="60" width="70" height="34"/>
            <text x="375" y="82" text-anchor="middle" font-size="10" stroke="none">laptop</text>
            <rect x="440" y="60" width="80" height="34" stroke="var(--accent)"/>
            <text x="480" y="82" text-anchor="middle" font-size="10" font-weight="700" stroke="none" fill="var(--accent)">SSM API</text>
            <text x="480" y="107" text-anchor="middle" font-size="9" stroke="none" class="fig-em">IAM authz</text>
            <rect x="550" y="60" width="60" height="34"/>
            <text x="580" y="82" text-anchor="middle" font-size="10" stroke="none">target</text>
            <text x="580" y="107" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">no :22 open</text>

            <path d="M 410 77 L 438 77" stroke="currentColor"/><polygon points="438,77 432,74 432,80" fill="currentColor"/>
            <path d="M 520 77 L 548 77" stroke="var(--accent)"/><polygon points="548,77 542,74 542,80" fill="var(--accent)"/>

            <!-- Wins -->
            <text x="480" y="150" text-anchor="middle" font-size="9" stroke="none" class="fig-em">no host to patch</text>
            <text x="480" y="164" text-anchor="middle" font-size="9" stroke="none" class="fig-em">no persistent keys</text>
            <text x="480" y="178" text-anchor="middle" font-size="9" stroke="none" class="fig-em">no inbound port</text>
            <text x="480" y="192" text-anchor="middle" font-size="9" stroke="none" class="fig-em">every session logged</text>
          </g>
        </svg>`,
        caption: 'Same access, two designs. On the left, the classic bastion has a public port 22 and an audit story that\'s "read the shell history." On the right, SSM / IAP / Tailscale open no port — the SDK authenticates to a control-plane API, which then opens a tunnel to the target that logs every keystroke.',
      },
      intro: "You can’t SSH to a database in a private subnet from your laptop — that’s the whole point of “private.” So how do operators reach private infrastructure at 2am? Historically: a <em>bastion host</em> — a single hardened server in a public subnet, the only inbound entry point, from which you jump to everything else. Modern setups replace the bastion with identity-aware managed services: AWS SSM Session Manager, GCP IAP, Azure Bastion, Tailscale, Teleport.\nThe shift is from “network position implies trust” to “every session is authenticated, authorised, and audited by identity, regardless of network position.” Zero-trust access is the direction of travel — no open port 22 on the internet, no shared SSH keys, no “oh they still had access after leaving.”",
      concepts: [
        ['Bastion host (classic)', "A single hardened server in a public subnet, the only host with an inbound port open from the internet. Operators SSH to the bastion, then SSH from there to private targets. Small attack surface (one server), one place to audit, one place to patch."],
        ['SSH ProxyJump', "SSH’s built-in jump-through syntax. <code>ssh -J bastion.example.com db.internal</code> — one command, tunnels through the bastion in one hop, no shell on the bastion. Configure defaults in <code>~/.ssh/config</code> with <code>ProxyJump</code>. Beats the old <code>ProxyCommand ssh -W</code> incantation."],
        ['Session recording & audit', "The compliance argument for bastions: every session that transits the bastion can be logged (typescript, teleport session recording, CloudWatch integration). Sensitive shops record every keystroke and every displayed byte."],
        ['MFA gating & short-lived certs', "Modern bastions don’t accept plain SSH keys. Instead: OIDC login → issued a short-lived SSH certificate (Vault SSH secrets engine, Teleport, Smallstep) that expires in an hour. No permanent keys means no “ex-employee still has access.”"],
        ['AWS SSM Session Manager', "Agentless bastion replacement. The target EC2 instance runs the SSM Agent (built-in on Amazon Linux and default Ubuntu AMIs). Operators run <code>aws ssm start-session --target i-abc</code> — the session tunnels through AWS, no inbound port opened, no bastion host, authenticated by IAM. Session logs go to CloudWatch."],
        ['SSM port forwarding', "Tunnel any private TCP port to your laptop through IAM: <code>aws ssm start-session --target i-abc --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters host=db.internal,portNumber=5432,localPortNumber=15432</code>. No bastion, no VPN, IAM-only. Life-changing for cloud operators."],
        ['GCP IAP (Identity-Aware Proxy)', "Google’s equivalent. <code>gcloud compute ssh instance-x --tunnel-through-iap</code> — Google-account-authenticated SSH tunnel to a private instance. Also supports arbitrary TCP tunnelling. Works with BeyondCorp zero-trust posture policies."],
        ['Azure Bastion', "Azure’s managed PaaS bastion — HTML5 in-browser SSH/RDP to private VMs, no client installed, authenticated via Azure AD. Also supports native SSH client tunnels for CLI users."],
        ['Tailscale & WireGuard mesh', "A zero-config VPN mesh built on WireGuard, with SSO auth. Every device gets a Tailscale IP; ACLs govern who can reach what. Removes the “inbound port” problem — no public endpoint, and access is per-identity. See [[vpn]] for the underlying protocol."],
        ['Teleport & identity-aware proxies', "A gateway that fronts SSH, Kubernetes, databases, web apps, and desktops. Every session is tied to a real user identity, MFA-gated, recorded, and expires with the user’s session. The mature vendor answer to the zero-trust story."],
        ['Kubernetes access', "<code>kubectl</code> doesn’t need a bastion — it talks to the API server, which is what you protect. For private clusters: EKS Cluster Endpoint access from allow-listed CIDRs, GKE Private Cluster + IAP, or a Teleport-fronted kubeconfig. For pod-level shells, <code>kubectl exec</code> tunnels through the API server."],
        ['No inbound ports at all', "The zero-trust endgame. Every workload sits behind an identity-aware proxy or a reverse tunnel it initiates outbound. Nothing on the public internet accepts inbound traffic except the identity-aware proxy itself. Cloudflare Zero Trust, Google BeyondCorp, Tailscale Funnel all take this shape."],
      ],
      code: `<span class="c"># ~/.ssh/config — jump through a bastion with one keystroke</span>
<span class="k">Host</span> bastion
  <span class="k">HostName</span> bastion.example.com
  <span class="k">User</span> ec2-user
  <span class="k">IdentityFile</span> ~/.ssh/bastion_ed25519

<span class="k">Host</span> db-*
  <span class="k">User</span> ec2-user
  <span class="k">ProxyJump</span> bastion                       <span class="c"># tunnel through bastion for any db-* host</span>

<span class="c"># now:  ssh db-1.internal    (tunnels via bastion transparently)</span>

<span class="c"># --- AWS SSM: no bastion at all ---</span>
$ aws ssm start-session --target i-0abcd1234
$ aws ssm start-session --target i-0abcd1234 \\
    --document-name AWS-StartPortForwardingSessionToRemoteHost \\
    --parameters host=db.internal,portNumber=5432,localPortNumber=15432
$ psql -h localhost -p 15432                        <span class="c"># prod DB, IAM-authenticated tunnel, no bastion</span>

<span class="c"># --- GCP IAP tunnel ---</span>
$ gcloud compute ssh my-vm --zone=europe-west1-b --tunnel-through-iap
$ gcloud compute start-iap-tunnel my-vm 5432 \\
    --local-host-port=localhost:15432 --zone=europe-west1-b

<span class="c"># --- Tailscale: SSH by hostname, MFA-gated, no port open ---</span>
$ tailscale up --ssh
$ ssh admin@db-1                                    <span class="c"># works from anywhere Tailscale is up</span>`,
      codeCap: 'ProxyJump for the classic pattern; SSM/IAP/Tailscale for the modern one. The trend line is unmistakable: away from “open a port,” toward “authenticate an identity.”',
      quiz: [
        { q: 'What is the purpose of a bastion host?', options: ['To serve traffic to end users', 'A single hardened server in a public subnet — the only inbound entry point — used to reach private-subnet infrastructure', 'A backup of the primary application', 'A CDN edge server'], correct: 1, why: 'One place to audit, one place to patch, one door to guard.' },
        { q: 'What does SSH <code>ProxyJump</code> do?', options: ['Copies a file to a remote host', 'Transparently tunnels through one or more intermediate hosts in a single <code>ssh</code> command — no shell on the intermediary, no double login', 'Restarts sshd', 'Bypasses SSH authentication'], correct: 1, why: '<code>ssh -J bastion target</code>, or <code>ProxyJump bastion</code> in ~/.ssh/config for defaults.' },
        { q: 'What does AWS SSM Session Manager give you that a classic bastion doesn’t?', options: ['A faster SSH client', 'Agentless (via SSM Agent), IAM-authenticated shell to private instances with no inbound port opened and full session logging — no bastion host needed', 'Cheaper compute', 'A backup of the target'], correct: 1, why: 'Also supports port-forwarding a private DB to your laptop with the same IAM-authenticated tunnel.' },
        { q: 'Why prefer short-lived SSH certificates over long-lived keys on a bastion?', options: ['Certificates are faster', "Certificates expire (typically minutes to hours), so a compromised copy loses value quickly and there's no “ex-employee still has access” problem", 'Certificates are optional', 'Keys don’t work at all on Linux'], correct: 1, why: 'Vault SSH secrets engine, Teleport, Smallstep all issue short-lived certs after OIDC + MFA.' },
        { q: 'What is the zero-trust endgame for access to internal infrastructure?', options: ['Trust anyone on the corporate network', "No inbound ports on the internet at all — every workload sits behind an identity-aware proxy, every session is authenticated + authorised + audited by identity, network position implies nothing", 'Everyone shares one strong password', 'Public IPs on every service'], correct: 1, why: 'Cloudflare Zero Trust, Google BeyondCorp, Tailscale, Teleport all take this shape. The bastion goes away.' },
      ],
    },

    {
      id: 'patterns',
      part: 4,
      num: '25',
      title: 'Design Patterns',
      tag: 'The dozen patterns you keep meeting — resilience, deployment, structural, data — named once so you can recognise them everywhere.',
      figure: {
        tag: 'Figure 1 · Retry with backoff + circuit breaker',
        svg: `<svg class="figure-svg" viewBox="0 0 620 240" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <!-- Timeline axis -->
          <line x1="30" y1="140" x2="600" y2="140" stroke="currentColor"/>
          <text x="30" y="158" font-size="9" stroke="none" class="fig-muted">t=0</text>
          <text x="600" y="158" text-anchor="end" font-size="9" stroke="none" class="fig-muted">→ time</text>

          <!-- Retry attempts as spikes with growing spacing -->
          <g stroke="currentColor" fill="currentColor">
            <line x1="60"  y1="140" x2="60"  y2="90"/>
            <text x="60"  y="82" text-anchor="middle" font-size="9" stroke="none">try 1</text>
            <text x="60"  y="110" text-anchor="middle" font-size="9" stroke="none" fill="var(--danger)">✕</text>
          </g>
          <g stroke="currentColor" fill="currentColor">
            <line x1="90"  y1="140" x2="90"  y2="90"/>
            <text x="90"  y="82" text-anchor="middle" font-size="9" stroke="none">try 2</text>
            <text x="90"  y="110" text-anchor="middle" font-size="9" stroke="none" fill="var(--danger)">✕</text>
            <text x="75"  y="160" text-anchor="middle" font-size="8" stroke="none" class="fig-muted">100ms</text>
          </g>
          <g stroke="currentColor" fill="currentColor">
            <line x1="150" y1="140" x2="150" y2="90"/>
            <text x="150" y="82" text-anchor="middle" font-size="9" stroke="none">try 3</text>
            <text x="150" y="110" text-anchor="middle" font-size="9" stroke="none" fill="var(--danger)">✕</text>
            <text x="120" y="160" text-anchor="middle" font-size="8" stroke="none" class="fig-muted">±jitter · 200ms</text>
          </g>
          <g stroke="currentColor" fill="currentColor">
            <line x1="250" y1="140" x2="250" y2="90"/>
            <text x="250" y="82" text-anchor="middle" font-size="9" stroke="none">try 4</text>
            <text x="250" y="110" text-anchor="middle" font-size="9" stroke="none" fill="var(--danger)">✕</text>
            <text x="200" y="160" text-anchor="middle" font-size="8" stroke="none" class="fig-muted">±jitter · 400ms</text>
          </g>

          <!-- Circuit trips -->
          <g stroke="var(--accent)" fill="none">
            <rect x="290" y="60" width="290" height="60" stroke-width="1.5"/>
            <text x="435" y="80" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">circuit OPEN</text>
            <text x="435" y="98" text-anchor="middle" font-size="9" stroke="none" fill="var(--accent)">fail fast · no calls</text>
            <text x="435" y="112" text-anchor="middle" font-size="9" stroke="none" fill="var(--accent)">30s cool-off</text>
          </g>
          <g stroke="currentColor" fill="currentColor">
            <line x1="565" y1="140" x2="565" y2="90"/>
            <text x="565" y="82" text-anchor="middle" font-size="9" stroke="none">probe</text>
            <text x="565" y="110" text-anchor="middle" font-size="9" stroke="none" fill="var(--success)">✓</text>
          </g>

          <text x="30" y="200" font-size="10" font-weight="700" stroke="none" class="fig-muted">RETRY  ·  BACKOFF  ·  JITTER  ·  CIRCUIT  ·  PROBE</text>
          <text x="30" y="220" font-size="9" stroke="none" class="fig-muted">the four moves that turn a fragile RPC caller into a resilient distributed component</text>
        </svg>`,
        caption: 'Fail once, retry. Fail twice, retry after 100ms + jitter. Fail again, back off further. After N failures the circuit opens — no calls, fail fast — until a single probe confirms the downstream has recovered. Jitter is critical: without it, every client retries in unison and turns a bad moment into an outage.',
      },
      intro: "Every mature distributed system converges on the same handful of patterns for the same handful of problems: retries when the network flakes, timeouts so a slow dependency doesn’t drag you under, circuit breakers when a downstream is definitely dead, canaries when a deploy might be. Learning the names lets you recognise them, discuss them, and reach for the right one — instead of re-deriving each one under production pressure.\nThe patterns below split into four families: <em>resilience</em> (surviving partial failure), <em>deployment</em> (shipping change safely), <em>structural</em> (how services compose), and <em>data</em> (keeping distributed state consistent). None are silver bullets; all are trade-offs. But they’re the vocabulary of the trade.",
      concepts: [
        ['12-Factor App', "A checklist for cloud-native apps: config in env vars, stateless processes, port binding, disposability, dev/prod parity, treat logs as event streams, run admin tasks as one-off processes. Old but still the baseline sanity check. See <em>12factor.net</em>."],
        ['Timeout', "Set one on every network call, no exceptions. Without a timeout, a hung downstream ties up your resources until <em>they</em> notice. Rule of thumb: an outer timeout must be longer than every inner timeout it wraps."],
        ['Retry with exponential backoff + jitter', "Failed request? Retry after 100ms, then 200ms, then 400ms… with random jitter added. Backoff avoids hammering a struggling downstream; jitter avoids <em>thundering herds</em> where every client retries in sync at the exact same moment."],
        ['Circuit breaker', "Track failure rate to a downstream. Above a threshold, <em>open the circuit</em> — reject requests immediately without trying, for a cool-off window. Then <em>half-open</em>: let one through as a probe; if it succeeds, close the circuit. Netflix Hystrix, resilience4j, Polly. Also built into service meshes ([[service-mesh]])."],
        ['Bulkhead', "Isolate resource pools so one dependency’s failure can’t drown the whole app. Separate thread pool per downstream; separate connection pools per DB. Named after the compartments in a ship’s hull — a leak in one doesn’t sink the boat."],
        ['Idempotency & idempotency keys', "For non-idempotent operations (POST /charge), let the client attach a unique <em>Idempotency-Key</em> header. The server records the first result and returns the same result for retries with the same key. Standard in every payments API for good reason."],
        ['Blue-green deployment', "Run two identical environments — <em>blue</em> serving traffic, <em>green</em> idle. Deploy the new version to green, run smoke tests, switch the load balancer. Rollback = flip the switch back. Doubles infra cost briefly; buys instant, complete rollback."],
        ['Canary deployment', "Route a small % of traffic to the new version (5%), watch metrics, gradually ramp (20%, 50%, 100%). Detects bad releases without a full-scale blast. Combines with service-mesh weighted routing or ingress splitting. See [[service-mesh]] and [[argocd]]."],
        ['Feature flags', "Ship code disabled; enable it later by toggling a flag (LaunchDarkly, GrowthBook, Unleash, Flagsmith, or a config file). Decouples <em>deploy</em> from <em>release</em>. Ramp features to a % of users; kill-switch a bad feature without redeploying."],
        ['Immutable infrastructure', "Never SSH in and edit a server. If config drifts, replace the whole instance. Docker images and Terraform-managed VMs both embody this. Consequences: reproducible, auditable, replaceable. Eliminates the “works on that server” class of bug."],
        ['Sidecar & Ambassador', "<em>Sidecar</em>: a helper container running alongside the app in the same Pod, sharing its lifecycle. Adds cross-cutting concerns (logging, mTLS, config-reload) without modifying the app. <em>Ambassador</em>: a sidecar that proxies outbound traffic — the app talks localhost, ambassador handles service discovery, retries, TLS. See [[service-mesh]]."],
        ['Saga', "A long-running business transaction spanning multiple services, split into local transactions with <em>compensating actions</em>. If step 3 fails, run compensations for 1 and 2 to undo. Replaces the impossible-at-scale distributed transaction."],
        ['Outbox pattern', "For reliably publishing an event alongside a DB write: write the business row and an outbox row in the same DB transaction. A separate process reads outbox rows and publishes to the broker. Avoids the classic bug where the DB commits but the message publish fails. See [[queues]]."],
        ['CQRS & Event Sourcing', "<em>CQRS</em> (Command-Query Responsibility Segregation): separate write model (accepts commands) from read model (serves queries), often with different storage. <em>Event Sourcing</em>: state is derived by replaying an append-only log of events. Powerful for audit-heavy or highly-scaled reads; overkill for a CRUD app."],
        ['Leader election', "When exactly one instance must act as leader (a scheduler, a stream consumer), instances race to acquire a lease in a shared store (etcd, Zookeeper, Redis, K8s Lease). The winner leads; if it dies, its lease expires and another wins. Built into K8s controller-runtime and every serious framework."],
      ],
      code: `<span class="c"># Retry with exponential backoff + jitter (Python)</span>
<span class="k">import</span> time, random

<span class="k">def</span> call_with_retry(fn, max_attempts=<span class="n">5</span>, base=<span class="n">0.1</span>, cap=<span class="n">10.0</span>):
    <span class="k">for</span> attempt <span class="k">in</span> range(max_attempts):
        <span class="k">try</span>:
            <span class="k">return</span> fn()
        <span class="k">except</span> TransientError <span class="k">as</span> e:
            <span class="k">if</span> attempt == max_attempts - <span class="n">1</span>:
                <span class="k">raise</span>
            sleep = min(cap, base * <span class="n">2</span>**attempt) * (<span class="n">0.5</span> + random.random())
            time.sleep(sleep)     <span class="c"># backoff + full jitter</span>

<span class="c"># Circuit breaker (pseudocode)</span>
<span class="k">class</span> Circuit:
    <span class="k">def</span> call(self, fn):
        <span class="k">if</span> self.state == <span class="s">"OPEN"</span> <span class="k">and</span> time.now() &lt; self.opened_until:
            <span class="k">raise</span> CircuitOpen()               <span class="c"># fail fast, don't try</span>
        <span class="k">try</span>:
            r = fn()
            self.on_success()
            <span class="k">return</span> r
        <span class="k">except</span>:
            self.on_failure()                   <span class="c"># if failure rate crosses threshold, OPEN</span>
            <span class="k">raise</span>

<span class="c"># Outbox pattern — one DB transaction, event publish guaranteed</span>
<span class="k">with</span> db.transaction():
    db.execute(<span class="s">"INSERT INTO orders ..."</span>)
    db.execute(<span class="s">"INSERT INTO outbox (topic, payload) VALUES (?, ?)"</span>, <span class="s">"orders"</span>, order.json())
<span class="c"># A separate worker reads outbox rows, publishes to Kafka, deletes on ack.</span>`,
      codeCap: 'Backoff+jitter, circuit breaker, outbox — three tiny patterns that turn a fragile RPC caller into a resilient distributed component.',
      quiz: [
        { q: 'Why add <em>jitter</em> to retry backoff?', options: ['To make the code more random for fun', "Without jitter, many clients retry in lockstep at the same instants (100ms, 200ms, 400ms), producing a thundering herd that keeps the downstream on its knees", 'To slow retries down further', 'It’s optional; jitter has no real effect'], correct: 1, why: 'AWS builder’s library recommends full jitter — random(0, backoff) — over other variants.' },
        { q: 'What state does a circuit breaker enter when a downstream is definitely dead?', options: ['CLOSED — allow calls', 'OPEN — reject calls immediately without trying, for a cool-off period', 'FROZEN', 'STOPPED'], correct: 1, why: 'After the cool-off, it goes HALF-OPEN, lets one probe request through, and either re-opens or closes based on the outcome.' },
        { q: 'What is the essential idea of blue-green deployment?', options: ['A colour scheme for dashboards', "Run two identical environments; deploy the new version to the idle one; switch the load balancer when ready; instant rollback by flipping back", 'Deploy every service in blue and green stripes', 'A branding technique'], correct: 1, why: 'Costs a full duplicate briefly; buys near-instant rollback.' },
        { q: 'What is the outbox pattern for?', options: ['Managing incoming email', "Reliably publishing an event alongside a DB write — both go into the same transaction, a separate process publishes rows to the broker afterwards, so a partial failure can’t drop the event", 'Storing outgoing HTTP requests', 'A rate-limiting technique'], correct: 1, why: 'Solves the classic “dual-write” problem where you write to two systems and one succeeds, one fails.' },
        { q: 'What do feature flags decouple?', options: ['Frontend from backend', "Deploy from release — ship code disabled, enable it later via a toggle, ramp to % of users, kill-switch a bad feature without redeploying", 'CI from CD', 'The database from the application'], correct: 1, why: 'LaunchDarkly, GrowthBook, Unleash, Flagsmith are the tooling. Also enables trunk-based dev without long-lived branches.' },
      ],
    },

    {
      id: 'logs',
      part: 5,
      num: '27',
      title: 'Logs & Loki',
      tag: 'Discrete events with context — structured logs, correlation IDs, LogQL, and cheap-at-scale storage.',
      figure: {
        tag: 'Figure 1 · Loki indexes labels, not the log body',
        svg: `<svg class="figure-svg" viewBox="0 0 620 240" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <g>
            <rect x="20" y="30" width="580" height="60"/>
            <text x="30" y="50" font-size="10" font-weight="700" stroke="none">A log line</text>
            <text x="30" y="70" font-size="10" font-family="var(--font-mono)" stroke="none" class="fig-muted">{app="api", env="prod", level="error"}  "payment failed" user_id=42 request_id=abc-xyz-123 …</text>
            <line x1="152" y1="60" x2="288" y2="60" stroke="var(--accent)" stroke-width="0.5" stroke-dasharray="2 2"/>
            <text x="220" y="82" text-anchor="middle" font-size="9" stroke="none" fill="var(--accent)" font-weight="700">↑ labels (indexed)</text>
            <line x1="300" y1="60" x2="580" y2="60" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4"/>
            <text x="450" y="82" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">↑ body (compressed, scanned on query)</text>
          </g>

          <g>
            <rect x="60" y="130" width="180" height="80" stroke="var(--accent)"/>
            <text x="150" y="152" text-anchor="middle" font-size="11" font-weight="700" stroke="none" fill="var(--accent)">index</text>
            <text x="150" y="170" text-anchor="middle" font-size="9" stroke="none" class="fig-em">tiny · labels only</text>
            <text x="150" y="188" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">where are prod api errors?</text>

            <rect x="380" y="130" width="180" height="80"/>
            <text x="470" y="152" text-anchor="middle" font-size="11" font-weight="700" stroke="none">chunks</text>
            <text x="470" y="170" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">compressed body</text>
            <text x="470" y="188" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">in object storage (S3)</text>
          </g>

          <path d="M 240 170 L 378 170" stroke="currentColor"/><polygon points="378,170 373,167 373,173" fill="currentColor"/>
          <text x="309" y="162" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">scan only matching chunks</text>
        </svg>`,
        caption: 'Loki takes the Prometheus trick and applies it to logs: index only the labels, store the body compressed in cheap object storage. That\'s why it costs a fraction of Elasticsearch at the same volume — you pay for scanning at query time, not for indexing at ingest.',
      },
      intro: "Logs are the story a system tells about itself, one event at a time. Unlike metrics — which are pre-aggregated numbers — logs preserve the specifics: which user, which request ID, which error, which stack trace. That specificity is expensive at scale, so mature logging is a discipline of <em>structuring</em>, <em>sampling</em>, and <em>routing</em> — not a firehose of unstructured text.\nThe reference open-source stack is <em>Loki</em>, from Grafana Labs — built on the deliberate insight that you don’t need to index every log line, just its labels (like Prometheus). This makes Loki dramatically cheaper than Elastic for log storage. Alternatives: Elasticsearch/OpenSearch (full-text indexed), Datadog Logs, Sumo Logic, Splunk (feature-rich, historically expensive), CloudWatch Logs (AWS-native).",
      concepts: [
        ['Structured logging', "Every log line is a JSON object with typed fields: <code>{\"level\":\"error\",\"msg\":\"payment failed\",\"user_id\":42,\"request_id\":\"abc\",\"amount\":19.99}</code>. Every field becomes queryable. Free-text logs are grep material; structured logs are data."],
        ['Log levels', "TRACE (extreme detail), DEBUG (development), INFO (routine events), WARN (something odd), ERROR (something failed), FATAL (something died). Ship INFO and above in production; enable DEBUG on demand via feature flag or config reload."],
        ['Correlation / Request IDs', "Every incoming request gets a unique ID (usually a UUID or a hex ID from the trace context). Propagate it through every downstream call in a header (<code>X-Request-Id</code>) and log it in every event. Then a single search reconstructs the full journey."],
        ['Contextual logging', "Attach persistent context (user ID, request ID, tenant) to the logger at the request boundary; every subsequent log within that request inherits it. Structured loggers (zap, logrus, pino, structlog) all support this."],
        ['Loki architecture', "Loki indexes only labels (like Prometheus). The log body is stored as compressed chunks in object storage (S3, GCS). No full-text index means <em>label design matters</em>: labels like <code>app</code>, <code>namespace</code>, <code>level</code> are fine; a label per user_id would explode cardinality."],
        ['LogQL', "Loki’s query language. Selector on labels then optional line filter: <code>{app=\"api\",level=\"error\"} |= \"timeout\"</code>. Metric queries too: <code>sum by (service) (rate({app=\"api\"} |= \"error\" [5m]))</code> counts error lines per service per second — bridges logs into the metrics world."],
        ['Cardinality — the same trap as metrics', "High-cardinality labels (user_id, request_id, trace_id) will kill Loki as fast as they kill Prometheus. Put those in the log <em>body</em> as JSON fields, extract them at query time with <code>| json</code> and match with <code>| user_id=\"42\"</code>. Cross-ref: [[monitoring]]."],
        ['Sampling & retention', "Not every DEBUG line needs to survive. Sample by service, by level, by ratio. Retention: hot storage for 7 days for on-call, warm for 30, cold in object storage for 1 year for compliance. Loki does this via storage-class transitions."],
        ['Log shipping pipelines', "How logs get from apps to storage. <em>Fluent Bit</em>: lightweight, C-based, ubiquitous DaemonSet on K8s. <em>Vector</em>: Rust-based, fast, rich transforms. <em>Fluentd</em>: older Ruby, feature-rich. <em>Promtail</em>: Grafana’s Loki-native shipper. <em>Alloy</em>: Grafana’s newer unified agent for logs + metrics + traces (see [[grafana]])."],
        ['Log-based alerts', "Alert when a certain log line appears too often — or stops appearing. <em>Grafana Alerting on LogQL</em>: <code>sum(rate({app=\"payments\",level=\"error\"}[5m])) &gt; 5</code>. Especially useful when your app doesn’t emit metrics for a failure but does log it."],
        ['PII & sensitive data', "Never log raw passwords, tokens, or PII. Structured loggers can filter/mask specific fields automatically. Regulated environments run scrubbers (Vector transforms, cloud-native tools) between the app and storage."],
        ['SIEM integration', "Security teams tail your logs into a SIEM (Splunk, Elastic Security, Sumo, Datadog, Grafana Loki + Grafana Security). Auth events, admin actions, denied requests, network flows — all funneled to a place where security correlations run. See [[waf]]."],
      ],
      code: `<span class="c"># Structured logging (Python + structlog)</span>
<span class="k">import</span> structlog
log = structlog.get_logger().bind(service=<span class="s">"api"</span>, env=<span class="s">"prod"</span>)

<span class="k">def</span> handle_charge(user_id, amount, request_id):
    l = log.bind(user_id=user_id, request_id=request_id)
    l.info(<span class="s">"charge.start"</span>, amount=amount)
    <span class="k">try</span>:
        result = charge(amount)
        l.info(<span class="s">"charge.ok"</span>, txn=result.id)
    <span class="k">except</span> Exception <span class="k">as</span> e:
        l.error(<span class="s">"charge.fail"</span>, err=str(e), amount=amount)
        <span class="k">raise</span>

<span class="c"># Emitted as JSON:</span>
<span class="c"># {"service":"api","env":"prod","user_id":42,"request_id":"abc","event":"charge.fail","err":"timeout","amount":19.99,"level":"error"}</span>

<span class="c"># --- LogQL queries you'll actually run ---</span>

<span class="c"># All error lines in api during last 5 minutes</span>
{app=<span class="s">"api"</span>, level=<span class="s">"error"</span>} [<span class="n">5m</span>]

<span class="c"># Rate of 5xx-like errors per service</span>
sum by (service) (
  rate({namespace=<span class="s">"prod"</span>} |= <span class="s">"error"</span> [<span class="n">5m</span>])
)

<span class="c"># Extract JSON fields, then filter by user_id</span>
{app=<span class="s">"api"</span>, level=<span class="s">"error"</span>}
  | json
  | user_id=<span class="s">"42"</span>
  | line_format <span class="s">"{{.request_id}}  {{.event}}  {{.err}}"</span>

<span class="c"># --- Fluent Bit DaemonSet config (K8s pods → Loki) ---</span>
<span class="k">[INPUT]</span>
    Name        tail
    Path        /var/log/containers/*.log
    Parser      docker
    Tag         kube.*

<span class="k">[OUTPUT]</span>
    Name        loki
    Match       kube.*
    Url         http://loki:3100/loki/api/v1/push
    Labels      job=fluent-bit, cluster=prod, $kubernetes['namespace_name']`,
      codeCap: 'Bind context once, log JSON, query with LogQL. Loki indexes only labels — put user IDs in the body, extract with <code>| json</code>.',
      quiz: [
        { q: 'Why prefer structured (JSON) logs over free-text lines?', options: ['They look prettier', 'Every field is typed and queryable — you can filter by user_id or level without regex-ing free text; structured loggers can also mask/scrub sensitive fields', 'They are smaller on disk', 'They are required by law'], correct: 1, why: 'Grep is fine for one server; not fine for a fleet with a query engine in front.' },
        { q: 'What key architectural choice makes Loki cheaper than Elasticsearch for logs?', options: ['Compression algorithm', 'Loki indexes only labels (not the log body), storing bodies as compressed chunks in object storage — full-text queries scan on demand instead of paying for a full inverted index', 'Uses Postgres internally', 'Only stores errors'], correct: 1, why: 'Same insight as Prometheus for metrics: index the shape, not the content.' },
        { q: 'What should you NOT use as a Loki label?', options: ['<code>app</code>, <code>namespace</code>, <code>level</code>', 'High-cardinality values like <code>user_id</code> or <code>request_id</code> — put those in the log body and extract with <code>| json</code>', 'Static values like <code>cluster=prod</code>', 'The service name'], correct: 1, why: 'Same cardinality trap as Prometheus. Millions of label combinations = melted index.' },
        { q: 'What does a correlation / request ID do?', options: ['Encrypts logs', 'Ties every log line across every service for one request together via a shared ID, so a single search reconstructs the full journey', 'Deduplicates logs', 'Compresses logs'], correct: 1, why: 'Propagate it in an HTTP header (X-Request-Id or W3C traceparent) so downstream services log with the same ID.' },
        { q: 'A LogQL query <code>sum by (service) (rate({env=\"prod\"} |= \"error\" [5m]))</code> gives you…', options: ['Raw log lines', 'A metric derived from logs: error-line rate per second, aggregated by service — usable in Grafana dashboards and alerts alongside real metrics', 'A list of user IDs', 'A syntax error'], correct: 1, why: 'This bridges logs into the metrics world — great when the app doesn’t emit a proper metric for the failure but does log it.' },
      ],
    },

    {
      id: 'traces',
      part: 5,
      num: '28',
      title: 'Traces & OpenTelemetry',
      tag: 'Follow one request across every service it touches — spans, context propagation, sampling, and the vendor-neutral SDK that ties it together.',
      figure: {
        tag: 'Figure 1 · A trace is a tree of spans',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <!-- Timeline axis -->
          <line x1="120" y1="30" x2="600" y2="30" stroke="currentColor" opacity="0.4"/>
          <text x="120" y="20" font-size="9" stroke="none" class="fig-muted">0ms</text>
          <text x="600" y="20" text-anchor="end" font-size="9" stroke="none" class="fig-muted">450ms</text>

          <!-- Root span -->
          <g>
            <text x="20" y="55" font-size="10" stroke="none">POST /order</text>
            <rect x="120" y="46" width="440" height="16" fill="var(--accent-quiet)" stroke="var(--accent)"/>
            <text x="565" y="58" font-size="9" stroke="none" class="fig-muted">440ms</text>
          </g>
          <!-- Child spans -->
          <g>
            <text x="30" y="85" font-size="10" stroke="none" class="fig-muted">├ validate</text>
            <rect x="120" y="76" width="60" height="14" fill="currentColor" opacity="0.15" stroke="currentColor"/>

            <text x="30" y="115" font-size="10" stroke="none" class="fig-muted">├ auth check</text>
            <rect x="180" y="106" width="30" height="14" fill="currentColor" opacity="0.15" stroke="currentColor"/>

            <text x="30" y="145" font-size="10" stroke="none" class="fig-muted">├ DB write</text>
            <rect x="210" y="136" width="120" height="14" fill="currentColor" opacity="0.15" stroke="currentColor"/>

            <text x="30" y="175" font-size="10" stroke="none" class="fig-muted">├ payment API</text>
            <rect x="330" y="166" width="200" height="14" fill="var(--danger, currentColor)" opacity="0.35" stroke="var(--danger, currentColor)"/>
            <text x="540" y="177" font-size="9" stroke="none" fill="var(--danger, currentColor)">slow!</text>

            <text x="30" y="205" font-size="10" stroke="none" class="fig-muted">└ enqueue email</text>
            <rect x="530" y="196" width="20" height="14" fill="currentColor" opacity="0.15" stroke="currentColor"/>
          </g>

          <text x="20" y="240" font-size="10" font-weight="700" stroke="none" class="fig-muted">the 200ms payment-API span tells you exactly which downstream is slow</text>
        </svg>`,
        caption: 'One request becomes a tree of spans — parent, children, grandchildren — each with a start, a duration, a service. In the timeline, the anomalous span is instantly visible: this request spent 200ms in the payment API, and now you know which downstream to profile.',
      },
      intro: "A metric tells you <em>something is slow</em>. A log tells you <em>this specific request failed</em>. A trace tells you <em>where inside a 15-service call chain the time actually went</em>. Distributed tracing is what makes debugging modern microservice systems tractable — without it, a P99 latency regression could be any of a hundred services.\nOpenTelemetry (OTel) is the vendor-neutral standard. Language SDKs emit spans in a common format (OTLP); you send OTLP to any backend — Tempo, Jaeger, Honeycomb, Datadog, cloud APMs — and switch backends without touching the app. Learn OTel once; use it forever.",
      concepts: [
        ['Trace, Span, Parent-Child', "A <em>trace</em> is one request’s journey. A <em>span</em> is one unit of work within it — a service, an operation, a duration, some attributes. Spans have parent-child relationships forming a tree. Root span = the entry point (an incoming HTTP request); leaf spans = the deepest calls (a DB query)."],
        ['Trace ID & Span ID', "Every trace has a unique <em>trace_id</em>; every span has a unique <em>span_id</em>. Spans reference their parent by span_id. These are the identifiers you propagate — everything else derives from them."],
        ['Context propagation', "How the trace context travels between services. The <em>W3C Trace Context</em> standard defines the <code>traceparent</code> HTTP header: <code>traceparent: 00-{trace_id}-{parent_span_id}-{flags}</code>. Every OTel SDK reads it on incoming requests, writes it on outgoing. Break the chain and the trace splits."],
        ['OpenTelemetry SDK', "The instrumentation library for your language (Python, Go, Java, JS, Rust, .NET, Ruby...). Provides <em>tracers</em>, <em>meters</em> (for metrics), and <em>loggers</em>, all in one SDK. You either instrument manually (<code>with tracer.start_as_current_span(\"charge\") as span: ...</code>) or use auto-instrumentation."],
        ['OTLP — the wire protocol', "<em>OpenTelemetry Protocol</em>, gRPC or HTTP/protobuf. What SDKs send. What collectors accept. What every backend now supports. Vendor-neutral by design — you can pipe OTLP to Tempo <em>and</em> Datadog <em>and</em> Honeycomb at the same time."],
        ['Auto- vs manual instrumentation', "<em>Auto</em>: an OTel agent wraps common libraries (HTTP servers, DB drivers, HTTP clients) at runtime, emitting spans without code changes. Java, Python, .NET have particularly strong auto-instrumentation. <em>Manual</em>: <code>@tracer.start_as_current_span</code> around your business operations. Real apps mix both."],
        ['Sampling — head vs tail', "You can’t store every trace at scale. <em>Head sampling</em>: decide at the root span (10% of requests). Simple but blind — an interesting slow trace might not be sampled. <em>Tail sampling</em>: buffer the whole trace, decide at the end (keep it if slow, if errored, if rare). Requires an OTel Collector to buffer."],
        ['Semantic conventions', "OTel defines standard attribute names: <code>http.method</code>, <code>http.status_code</code>, <code>db.system</code>, <code>db.statement</code>, <code>rpc.service</code>. Consistent conventions across every language mean dashboards and alerts work uniformly."],
        ['Exemplars — metrics ↔ traces', "A metric point (P99 latency spike at 14:32) can carry an <em>exemplar</em>: a link to a specific trace that contributed to that bucket. In Grafana, click the spike, see the trace. This is the killer bridge between the two pillars."],
        ['OpenTelemetry Collector', "A standalone service that receives OTLP (or vendor formats), transforms it (add resource attributes, sample, filter, redact PII), and exports to one or many backends. Run as a DaemonSet (per-node) or Deployment (central). <em>Alloy</em> is Grafana’s distribution — see [[grafana]]."],
        ['Backends', "<em>Tempo</em>: Grafana Labs’ trace store, object-storage-backed, cheap. <em>Jaeger</em>: original open-source, self-hosted UI. <em>Zipkin</em>: older, still fine. <em>Honeycomb</em>: powerful high-cardinality analytics, SaaS. <em>Datadog / New Relic / Dynatrace</em>: full APMs with traces built in. All accept OTLP."],
        ['Cost & performance', "Instrumentation isn’t free — every span costs CPU, memory, and network. Auto-instrumentation especially can double allocation rates in hot paths. Measure the overhead, sample aggressively, disable instrumentation for tight loops. In tail-sampled setups, the biggest cost is the Collector fleet."],
      ],
      code: `<span class="c"># OpenTelemetry — Python auto-instrumentation, one command</span>
$ opentelemetry-instrument \\
    --traces_exporter otlp --metrics_exporter otlp \\
    --service_name orders \\
    python app.py

<span class="c"># Or manual instrumentation for a business operation</span>
<span class="k">from</span> opentelemetry <span class="k">import</span> trace
tracer = trace.get_tracer(<span class="s">"orders"</span>)

<span class="k">def</span> handle_charge(user_id, amount):
    <span class="k">with</span> tracer.start_as_current_span(<span class="s">"charge"</span>) <span class="k">as</span> span:
        span.set_attribute(<span class="s">"user.id"</span>, user_id)
        span.set_attribute(<span class="s">"amount"</span>, amount)
        <span class="k">try</span>:
            result = payment_gateway.charge(amount)  <span class="c"># auto-instrumented, becomes a child span</span>
            span.set_attribute(<span class="s">"txn.id"</span>, result.id)
            <span class="k">return</span> result
        <span class="k">except</span> Exception <span class="k">as</span> e:
            span.record_exception(e)
            span.set_status(trace.StatusCode.ERROR)
            <span class="k">raise</span>

<span class="c"># W3C traceparent header propagated automatically by the SDK on outgoing calls:</span>
<span class="c"># traceparent: 00-a1b2c3d4e5f60718293a4b5c6d7e8f90-b7ad6b7169203331-01</span>

<span class="c"># --- OpenTelemetry Collector config: OTLP in → Tempo + tail sampling ---</span>
<span class="k">receivers</span>:
  <span class="k">otlp</span>:
    <span class="k">protocols</span>:
      <span class="k">grpc</span>: { <span class="k">endpoint</span>: <span class="s">"0.0.0.0:4317"</span> }
      <span class="k">http</span>: { <span class="k">endpoint</span>: <span class="s">"0.0.0.0:4318"</span> }

<span class="k">processors</span>:
  <span class="k">tail_sampling</span>:
    <span class="k">decision_wait</span>: <span class="s">10s</span>
    <span class="k">policies</span>:
      - { <span class="k">name</span>: <span class="s">errors</span>,   <span class="k">type</span>: <span class="s">status_code</span>, <span class="k">status_code</span>: { <span class="k">status_codes</span>: [ERROR] } }
      - { <span class="k">name</span>: <span class="s">slow</span>,     <span class="k">type</span>: <span class="s">latency</span>,     <span class="k">latency</span>: { <span class="k">threshold_ms</span>: <span class="n">500</span> } }
      - { <span class="k">name</span>: <span class="s">sample-1</span>, <span class="k">type</span>: <span class="s">probabilistic</span>, <span class="k">probabilistic</span>: { <span class="k">sampling_percentage</span>: <span class="n">1</span> } }

<span class="k">exporters</span>:
  <span class="k">otlp/tempo</span>:
    <span class="k">endpoint</span>: <span class="s">tempo:4317</span>
    <span class="k">tls</span>: { <span class="k">insecure</span>: <span class="n">true</span> }

<span class="k">service</span>:
  <span class="k">pipelines</span>:
    <span class="k">traces</span>:
      <span class="k">receivers</span>:  [otlp]
      <span class="k">processors</span>: [tail_sampling]
      <span class="k">exporters</span>:  [otlp/tempo]`,
      codeCap: 'Instrument once, propagate the context automatically, tail-sample at the Collector so you keep every error and every slow trace, and 1% of the rest.',
      quiz: [
        { q: 'What is a <em>span</em>?', options: ['A time range on a dashboard', 'One unit of work inside a trace — a service, an operation, a duration, attributes, and a parent span ID', 'A whole trace', 'A log line'], correct: 1, why: 'Spans form a tree rooted at the initial request; leaves are the deepest calls (DB queries, downstream RPCs).' },
        { q: 'What is the W3C <code>traceparent</code> header for?', options: ['Marks a request as a parent', 'Carries the trace context (trace_id + parent_span_id + flags) between services so a request’s spans stay linked as one trace', 'A rate-limit signal', 'A cookie replacement'], correct: 1, why: 'Every OTel SDK reads it on incoming and writes it on outgoing HTTP calls. Break the chain, split the trace.' },
        { q: 'Why is OpenTelemetry considered vendor-neutral?', options: ['It is free', 'Instrumentation SDKs emit OTLP; every major tracing backend accepts OTLP; you can swap backends without changing app code', 'It only runs on-prem', 'It is single-vendor'], correct: 1, why: 'That’s why OTel won the space: implement once, ship traces to Tempo today, Datadog tomorrow, no code change.' },
        { q: 'What’s the difference between head and tail sampling?', options: ['Head is faster', 'Head decides at the root span (10% of all traces); tail buffers each trace and decides after it completes (keep all errors, all slow ones, plus a small % of normal)', 'They are the same', 'Tail is deprecated'], correct: 1, why: 'Tail requires a Collector buffer per trace and enough memory, but keeps every interesting trace.' },
        { q: 'What is an <em>exemplar</em> in metrics?', options: ['A best-practice example', 'A pointer from a metric bucket to a specific trace that contributed to it — click the P99 latency spike in Grafana, land on the actual trace that caused it', 'A prime number', 'A type of sampler'], correct: 1, why: 'The bridge between metrics and traces — one of the most impactful features to enable in OTel.' },
      ],
    },

    {
      id: 'grafana',
      part: 5,
      num: '29',
      title: 'Grafana, Alloy & Alerting',
      tag: 'The dashboard, the pipeline, the alert — where all three pillars come together into an operator’s workspace.',
      figure: {
        tag: 'Figure 1 · One agent, three signals, one place to look',
        svg: `<svg class="figure-svg" viewBox="0 0 620 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
          <!-- Sources -->
          <g>
            <rect x="20" y="30" width="120" height="46"/>
            <text x="80" y="52" text-anchor="middle" font-size="10" font-weight="700" stroke="none">app pods</text>
            <text x="80" y="66" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">metrics · logs · traces</text>

            <rect x="20" y="110" width="120" height="46"/>
            <text x="80" y="132" text-anchor="middle" font-size="10" font-weight="700" stroke="none">nodes</text>
            <text x="80" y="146" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">host stats · syslog</text>

            <rect x="20" y="190" width="120" height="46"/>
            <text x="80" y="212" text-anchor="middle" font-size="10" font-weight="700" stroke="none">k8s state</text>
            <text x="80" y="226" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">events · Pod state</text>
          </g>

          <g fill="currentColor">
            <path d="M 140 53 L 178 88" stroke="currentColor"/><polygon points="178,88 171,86 175,80"/>
            <path d="M 140 133 L 178 133" stroke="currentColor"/><polygon points="178,133 173,130 173,136"/>
            <path d="M 140 213 L 178 178" stroke="currentColor"/><polygon points="178,178 175,186 171,180"/>
          </g>

          <!-- Alloy -->
          <g>
            <rect x="180" y="80" width="140" height="106" stroke="var(--accent)"/>
            <text x="250" y="106" text-anchor="middle" font-size="12" font-weight="700" stroke="none" fill="var(--accent)">Alloy</text>
            <text x="250" y="120" text-anchor="middle" font-size="9" stroke="none" class="fig-em">unified agent</text>
            <line x1="192" y1="128" x2="308" y2="128" opacity="0.4"/>
            <text x="250" y="146" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">receive · process</text>
            <text x="250" y="160" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">tail-sample</text>
            <text x="250" y="174" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">forward</text>
          </g>

          <g fill="currentColor">
            <path d="M 320 105 L 358 60" stroke="currentColor"/><polygon points="358,60 350,60 354,66"/>
            <path d="M 320 133 L 358 133" stroke="currentColor"/><polygon points="358,133 353,130 353,136"/>
            <path d="M 320 158 L 358 205" stroke="currentColor"/><polygon points="358,205 351,200 354,204" stroke-linejoin="miter"/>
          </g>

          <!-- Backends -->
          <g>
            <rect x="360" y="35" width="130" height="46"/>
            <text x="425" y="57" text-anchor="middle" font-size="10" font-weight="700" stroke="none">Mimir</text>
            <text x="425" y="71" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">metrics · Prom-compat</text>

            <rect x="360" y="110" width="130" height="46"/>
            <text x="425" y="132" text-anchor="middle" font-size="10" font-weight="700" stroke="none">Loki</text>
            <text x="425" y="146" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">logs · LogQL</text>

            <rect x="360" y="185" width="130" height="46"/>
            <text x="425" y="207" text-anchor="middle" font-size="10" font-weight="700" stroke="none">Tempo</text>
            <text x="425" y="221" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">traces · OTLP</text>
          </g>

          <path d="M 490 130 L 528 130" stroke="currentColor"/><polygon points="528,130 523,127 523,133" fill="currentColor"/>

          <!-- Grafana -->
          <g>
            <rect x="530" y="80" width="80" height="106"/>
            <text x="570" y="112" text-anchor="middle" font-size="11" font-weight="700" stroke="none">Grafana</text>
            <text x="570" y="128" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">dashboards</text>
            <text x="570" y="142" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">alerts</text>
            <text x="570" y="156" text-anchor="middle" font-size="9" stroke="none" class="fig-muted">exemplars</text>
          </g>
        </svg>`,
        caption: 'One Alloy agent collects metrics, logs, and traces from every source, forwards each to its backend, and Grafana pulls all three into one workspace. Exemplars close the loop — a P99 metric spike carries a link to the exact trace that caused it.',
      },
      intro: "Grafana is the free, open-source dashboard-and-alerting layer that everyone uses on top of Prometheus, Loki, Tempo, and dozens more data sources. Its power is in stitching signals together: a service’s dashboard shows metrics, log lines from Loki, and traces from Tempo in the same view — a P99 spike is one click away from the exact trace that caused it.\n<em>Alloy</em> is Grafana Labs’ collector — a single unified agent replacing Promtail (for logs), OTel Collector (for traces), and various other shippers. Configure it once and it pushes metrics, logs, and traces from every host and every workload. <em>Grafana Alerting</em> is the unified alert engine — one place to define rules against Prometheus, Loki, or any queryable source, and to route alerts through contact points and notification policies.",
      concepts: [
        ['Grafana dashboards', "Panels arranged on a grid, each panel bound to a query against a data source. Templating variables (<code>$service</code>, <code>$env</code>, <code>$namespace</code>) let one dashboard serve many contexts. Folders, permissions, teams, and orgs handle who sees what."],
        ['Panel types', "<em>Time series</em> (the workhorse). <em>Stat</em> (big single number, colour-coded). <em>Gauge</em>. <em>Bar chart</em>. <em>Table</em>. <em>Heatmap</em>. <em>Logs</em> (streams from Loki). <em>Traces</em> (span-tree view from Tempo). <em>Node graph</em>. <em>State timeline</em>. Pick per data shape."],
        ['Data sources', "Grafana connects to anything queryable. Built-in: Prometheus, Loki, Tempo, Mimir, Graphite, InfluxDB, Elasticsearch, Postgres, MySQL, CloudWatch, GCP Monitoring, Azure Monitor, Jaeger. Multi-source dashboards are the default — Prometheus metric, Loki log lines, Tempo traces on the same screen."],
        ['Grafana Loki, Tempo, Mimir, Pyroscope', "Grafana Labs’ own backends. <em>Loki</em>: logs. <em>Tempo</em>: traces. <em>Mimir</em>: Prometheus-compatible metrics at horizontal scale. <em>Pyroscope</em>: continuous profiling (CPU flamegraphs over time). All object-storage backed, all cheap at scale, all speak OTel + Prometheus."],
        ['Alloy — the unified collector', "Grafana’s next-generation agent, replacing Promtail, the classic Grafana Agent, and doubling as an OTel Collector. Single binary, single config, collects and forwards metrics, logs, and traces. Configuration uses <em>Grafana River</em> syntax — declarative pipelines from receiver → processor → exporter."],
        ['Grafana Alerting', "The unified alerting engine (introduced in Grafana 8). Define rules against any queryable data source (PromQL, LogQL, SQL, cloud APIs). Rules evaluate on a schedule and fire alerts. Replaces both classic dashboard alerts and Prometheus Alertmanager’s rule syntax."],
        ['Contact points & notification policies', "<em>Contact points</em>: destinations (Slack channel, PagerDuty service, email, webhook, MS Teams). <em>Notification policies</em>: tree-shaped routing based on labels — <code>severity=critical</code> → PagerDuty; <code>team=payments</code> → their Slack channel; default → email digest."],
        ['Silences & mute timings', "<em>Silences</em>: temporarily suppress alerts matching a label selector — during a known maintenance, or while a fix is deploying. <em>Mute timings</em>: named windows (business hours, weekends) applied to notification policies."],
        ['On-call & incident tooling', "Beyond alerts: <em>Grafana OnCall</em> (open-source on-call management), <em>Grafana Incident</em>, PagerDuty, Opsgenie, incident.io. Rotations, escalations, runbook links from every alert, post-incident review workflow."],
        ['Dashboards-as-code', "Store dashboards as JSON in git, sync with tooling: <em>Grafonnet</em> (Jsonnet library), <em>Grizzly</em>, Terraform Grafana provider, <em>Grafana Cloud stack IaC</em>. Change dashboards via PR; roll back with git; audit history."],
        ['Grafana Cloud', "The managed hosted offering — Grafana + Mimir + Loki + Tempo + OnCall as a SaaS, with a generous free tier. Especially handy for teams who don’t want to operate a metrics stack themselves. Federated data sources work too — keep some data self-hosted, ship the rest."],
        ['Screens that actually help on-call', "A good on-call dashboard: golden signals up top (traffic, errors, latency, saturation), current SLO burn rate, recent deploys overlaid as annotations, links to runbooks. A dashboard with 40 panels shows nothing; one with 8 focused panels tells a story."],
      ],
      code: `<span class="c"># Grafana Alloy — one config, all three signals flowing to Grafana Cloud</span>
<span class="c"># /etc/alloy/config.alloy (Grafana River syntax)</span>

<span class="k">logging</span> {
  <span class="k">level</span>  = <span class="s">"info"</span>
  <span class="k">format</span> = <span class="s">"logfmt"</span>
}

<span class="c">// ---- Metrics: scrape Prometheus /metrics endpoints ----</span>
<span class="k">prometheus.scrape</span> <span class="s">"apps"</span> {
  <span class="k">targets</span> = [{ __address__ = <span class="s">"app-1:8080"</span> }, { __address__ = <span class="s">"app-2:8080"</span> }]
  <span class="k">forward_to</span> = [prometheus.remote_write.default.receiver]
}
<span class="k">prometheus.remote_write</span> <span class="s">"default"</span> {
  <span class="k">endpoint</span> { <span class="k">url</span> = <span class="s">"https://prom.grafana.net/api/prom/push"</span> }
}

<span class="c">// ---- Logs: tail K8s pod logs, ship to Loki ----</span>
<span class="k">loki.source.kubernetes</span> <span class="s">"pods"</span> {
  <span class="k">targets</span>    = discovery.kubernetes.pods.targets
  <span class="k">forward_to</span> = [loki.write.default.receiver]
}
<span class="k">loki.write</span> <span class="s">"default"</span> {
  <span class="k">endpoint</span> { <span class="k">url</span> = <span class="s">"https://loki.grafana.net/loki/api/v1/push"</span> }
}

<span class="c">// ---- Traces: receive OTLP from apps, ship to Tempo ----</span>
<span class="k">otelcol.receiver.otlp</span> <span class="s">"in"</span> {
  <span class="k">grpc</span> { <span class="k">endpoint</span> = <span class="s">"0.0.0.0:4317"</span> }
  <span class="k">output</span> { <span class="k">traces</span> = [otelcol.exporter.otlp.tempo.input] }
}
<span class="k">otelcol.exporter.otlp</span> <span class="s">"tempo"</span> {
  <span class="k">client</span> { <span class="k">endpoint</span> = <span class="s">"tempo.grafana.net:4317"</span> }
}

<span class="c"># --- Grafana Alerting rule (unified format, defined in Grafana UI or as YAML) ---</span>
<span class="k">apiVersion</span>: <span class="n">1</span>
<span class="k">groups</span>:
  - <span class="k">name</span>: api
    <span class="k">rules</span>:
      - <span class="k">alert</span>: <span class="s">HighErrorRate</span>
        <span class="k">expr</span>: |
          sum(rate(http_requests_total{status=~<span class="s">"5.."</span>}[5m])) by (service)
          /
          sum(rate(http_requests_total[5m])) by (service)  <span class="k">&gt;</span>  <span class="n">0.02</span>
        <span class="k">for</span>: <span class="s">5m</span>
        <span class="k">labels</span>:    { <span class="k">severity</span>: <span class="s">critical</span>, <span class="k">team</span>: <span class="s">payments</span> }
        <span class="k">annotations</span>:
          <span class="k">summary</span>:  <span class="s">"{{ $labels.service }} 5xx rate above 2%"</span>
          <span class="k">runbook</span>:  <span class="s">"https://runbooks.example.com/api-5xx"</span>`,
      codeCap: 'One Alloy config, three pipelines (metrics, logs, traces). One alert rule, labels that route through notification policies. That’s a working observability stack.',
      quiz: [
        { q: 'What does Grafana Alloy replace?', options: ['Grafana itself', 'Promtail (logs), the classic Grafana Agent, and various OTel Collector deployments — one unified agent for metrics, logs, and traces', 'Prometheus', 'A CI runner'], correct: 1, why: 'Single binary, single config, one thing to install per host. Configured in Grafana River syntax.' },
        { q: 'Why are templating variables (<code>$service</code>, <code>$env</code>) valuable on Grafana dashboards?', options: ['They make queries slower', 'One dashboard serves many contexts — pick service and env from dropdowns instead of maintaining 20 similar dashboards', 'They encrypt values', 'They are decorative'], correct: 1, why: 'Combined with folder-scoped permissions, small teams can serve dozens of services from a handful of well-templated dashboards.' },
        { q: 'What are contact points and notification policies in Grafana Alerting?', options: ['UI colour choices', 'Contact points are destinations (Slack, PagerDuty, email); notification policies are tree-shaped routing rules on alert labels — severity=critical → PagerDuty, team=X → their channel', 'Replacements for dashboards', 'Free-tier features only'], correct: 1, why: 'Design the label taxonomy up front — severity, team, service, env — and the routing tree writes itself.' },
        { q: 'What is the value of viewing metrics, logs, and traces on the same dashboard?', options: ['It looks impressive', "Correlation — a P99 latency spike in the metric panel, the log lines that fired at that moment, and an exemplar link to the exact trace that caused it, all one click apart", 'It makes the browser faster', 'It’s the only option'], correct: 1, why: 'The whole point of observability platforms: pivot between signals during an incident without switching tools.' },
        { q: 'What is Grafana Mimir?', options: ['A UI framework', 'Grafana Labs’ Prometheus-compatible, horizontally-scalable metrics backend — same query language, object storage, multi-tenant', 'A logs pipeline', 'A profiling tool'], correct: 1, why: 'Tempo does the same for traces, Loki for logs, Pyroscope for profiles — the Grafana LGTM+P stack.' },
      ],
    },
  ];

