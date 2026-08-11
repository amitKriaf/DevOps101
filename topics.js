  // ---------- Content ----------
  const PARTS = [
    { roman: 'I',   title: 'The Foundations',           desc: 'Daily bread — code, containers, the shell, the packages beneath it all.' },
    { roman: 'II',  title: 'Networking & Traffic',      desc: 'How requests actually find your server, and what sits in front of it.' },
    { roman: 'III', title: 'Orchestration & GitOps',    desc: 'Running many things reliably; declaring what you want, letting a controller keep it true.' },
    { roman: 'IV',  title: 'Infrastructure & Cloud',    desc: 'Provisioning the ground you deploy onto — declaratively, from code.' },
    { roman: 'V',   title: 'Data, Operations & Security', desc: 'The database, the dashboards, the firewalls, the identities.' },
    { roman: 'VI',  title: 'Applications & AI Interfaces', desc: 'The contracts your applications speak — HTTP, SSE, and the newer LLM ones.' },
  ];

  const TOPICS = [
    {
      id: 'cicd',
      part: 0,
      num: '01',
      title: 'Continuous Integration & Delivery',
      tag: 'The rhythm section of software delivery — merge often, ship on a beat, keep the trunk always releasable.',
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
  <span class="k">script</span>: npm ci &amp;&amp; npm run lint          <span class="c"># fastest &amp; likeliest to fail — first</span>
  <span class="k">cache</span>: { <span class="k">key</span>: node, <span class="k">paths</span>: [node_modules/] }

<span class="k">unit-test</span>:
  <span class="k">stage</span>: <span class="s">test</span>
  <span class="k">script</span>: npm ci &amp;&amp; npm test -- --coverage
  <span class="k">artifacts</span>: { <span class="k">paths</span>: [coverage/], <span class="k">expire_in</span>: <span class="s">1 week</span> }

<span class="k">build-image</span>:
  <span class="k">stage</span>: <span class="s">build</span>
  <span class="k">script</span>:
    - docker build -t <span class="n">$IMAGE</span> .
    - docker push <span class="n">$IMAGE</span>                     <span class="c"># the ONE artifact from here on</span>

<span class="k">deploy-staging</span>:
  <span class="k">stage</span>: <span class="s">deploy-staging</span>
  <span class="k">environment</span>: { <span class="k">name</span>: <span class="s">staging</span>, <span class="k">url</span>: <span class="s">https://staging.example.com</span> }
  <span class="k">script</span>: kubectl -n staging set image deploy/api api=<span class="n">$IMAGE</span>
  <span class="k">rules</span>: [{ <span class="k">if</span>: <span class="s">'$CI_COMMIT_BRANCH == "main"'</span> }]

<span class="k">deploy-prod</span>:
  <span class="k">stage</span>: <span class="s">deploy-prod</span>
  <span class="k">environment</span>: { <span class="k">name</span>: <span class="s">production</span>, <span class="k">url</span>: <span class="s">https://example.com</span> }
  <span class="k">script</span>: kubectl -n prod set image deploy/api api=<span class="n">$IMAGE</span>
  <span class="k">rules</span>: [{ <span class="k">if</span>: <span class="s">'$CI_COMMIT_BRANCH == "main"'</span>, <span class="k">when</span>: <span class="s">manual</span> }]  <span class="c"># CD-style gate</span>`,
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
      intro: `A container is a Linux process running with its own view of the filesystem, network, and process tree. Cheaper than a VM because it shares the host kernel (no guest OS); more predictable than "run it on the server" because everything it needs is packaged with it. The primitives underneath are just Linux — <em>namespaces</em> for isolation and <em>cgroups</em> for resource limits — combined with a copy-on-write filesystem for layered images.
Docker made all of that ergonomic. It gave us a build language (the <code>Dockerfile</code>), an artifact format (the image), a runtime (the daemon and CLI), and a distribution format (registries). Today the wider ecosystem uses lower-level runtimes (<code>containerd</code>, <code>runc</code>) under the hood, but the Docker CLI and Dockerfile format are the durable interface almost every engineer speaks.`,
      concepts: [
        ['Namespaces & cgroups', 'The Linux primitives that make a container a container. <em>Namespaces</em> isolate what a process can see — pid, mount, network, uts, ipc, user. <em>Cgroups</em> limit what it can consume — CPU shares, memory ceiling, block I/O. A container is a process (or process tree) run inside a set of both.'],
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
      num: '09',
      title: 'Kubernetes',
      tag: 'A control loop keeping declared state and reality in agreement — pods, labels, probes, and thirteen objects you\'ll actually use.',
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
      num: '10',
      title: 'Helm',
      tag: 'A package manager for Kubernetes — apt for your cluster.',
      intro: `Kubernetes manifests are verbose and repetitive across environments. Helm bundles them into a chart — a directory of templated YAML plus a values file — and lets you install, upgrade, and roll back the whole bundle as one unit called a release.
It is the closest thing the Kubernetes ecosystem has to a shared packaging format.`,
      concepts: [
        ['Chart', 'The package: a directory with `Chart.yaml`, `values.yaml`, and a `templates/` folder of Go-templated manifests. Distributed as a tarball via a chart repository.'],
        ['`values.yaml`', 'The chart\'s default configuration. Users override individual values with `--set key=value` or their own values file on install/upgrade.'],
        ['Release', 'A specific installation of a chart into a cluster, with a name and a revision number. `helm list` shows them; every upgrade bumps the revision.'],
        ['Templating', 'Go text/template with the Sprig function library. `{{ .Values.image.tag }}`, `{{ include "app.fullname" . }}` — the same shape you see in kubectl manifests but interpolated.'],
        ['Rollback', '`helm rollback my-app 3` returns the release to a previous revision. Because the previous manifest is stored, undo is one command.'],
        ['Umbrella chart', 'A chart that lists other charts as dependencies in `Chart.yaml`. Handy for shipping "an application" that\'s actually five services.'],
      ],
      code: `<span class="c"># templates/deployment.yaml — Helm-ified</span>
<span class="k">apiVersion</span>: apps/v1
<span class="k">kind</span>: Deployment
<span class="k">metadata</span>:
  <span class="k">name</span>: <span class="n">{{ include "api.fullname" . }}</span>
<span class="k">spec</span>:
  <span class="k">replicas</span>: <span class="n">{{ .Values.replicaCount }}</span>
  <span class="k">template</span>:
    <span class="k">spec</span>:
      <span class="k">containers</span>:
        - <span class="k">name</span>: <span class="s">api</span>
          <span class="k">image</span>: <span class="s">"{{ .Values.image.repo }}:{{ .Values.image.tag }}"</span>

<span class="c"># install with overrides</span>
<span class="c">$ helm upgrade --install api ./chart \\</span>
<span class="c">    --set image.tag=1.4.3 --set replicaCount=5</span>`,
      codeCap: 'The `upgrade --install` pattern is idempotent — safe to run from CI whether or not the release already exists.',
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
      num: '14',
      title: 'Terraform',
      tag: 'Describe the infrastructure you want; let a plan tell you how to get there.',
      intro: `Terraform is HashiCorp's language and engine for provisioning infrastructure declaratively. You write .tf files in HCL, run <code>terraform plan</code> to see what will change, and <code>terraform apply</code> to make it so.
The essential trick is the state file: a JSON record of what Terraform has already built. Every plan is a diff between your code, that state, and the world.`,
      concepts: [
        ['Provider', 'A plugin that translates HCL resources into API calls against a specific platform — aws, google, azurerm, kubernetes, github, cloudflare, and hundreds more.'],
        ['Resource', 'A single managed object. `resource "aws_s3_bucket" "logs" { ... }` declares one bucket that Terraform will create, update, or destroy to match the config.'],
        ['State', 'The mapping between your code and the real objects. Local by default; production teams put it in a remote backend (S3+DynamoDB, Terraform Cloud, GCS) with locking.'],
        ['Plan & Apply', 'Two-phase change: `plan` computes and prints the diff, `apply` executes it. Never `apply` without reading the plan.'],
        ['Module', 'A reusable directory of Terraform code, taking inputs and producing outputs. `module "vpc" { source = "..." }` — the standard way to share and reuse.'],
        ['Import', '`terraform import` brings an already-existing resource (created by hand or by another tool) under Terraform\'s management by writing it into state.'],
      ],
      code: `<span class="c"># main.tf — a bucket and a versioning setting</span>
<span class="k">terraform</span> {
  <span class="k">required_providers</span> {
    <span class="k">aws</span> = { <span class="k">source</span> = <span class="s">"hashicorp/aws"</span>, <span class="k">version</span> = <span class="s">"~&gt; 5.0"</span> }
  }
}

<span class="k">provider</span> <span class="s">"aws"</span> {
  <span class="k">region</span> = <span class="s">"eu-west-1"</span>
}

<span class="k">resource</span> <span class="s">"aws_s3_bucket"</span> <span class="s">"logs"</span> {
  <span class="k">bucket</span> = <span class="s">"acme-logs-prod"</span>
}

<span class="k">resource</span> <span class="s">"aws_s3_bucket_versioning"</span> <span class="s">"logs"</span> {
  <span class="k">bucket</span> = aws_s3_bucket.logs.id
  <span class="k">versioning_configuration</span> { <span class="k">status</span> = <span class="s">"Enabled"</span> }
}`,
      codeCap: 'Two resources, one implicit dependency (bucket → versioning). Terraform builds the graph and plans in the right order.',
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
      num: '15',
      title: 'Ansible',
      tag: 'Configuration management, agentless and stateless — SSH, YAML, and modules that check before they act.',
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
      num: '11',
      title: 'ArgoCD & GitOps',
      tag: 'Git holds the desired state; a controller keeps the cluster in agreement.',
      intro: `GitOps takes CI/CD\'s "declarative pipeline" idea to its logical end: the desired state of your infrastructure lives in a Git repository, and a controller inside the cluster continuously reconciles the running cluster to match. If Git says three replicas, three replicas there will be — and if someone edits the deployment by hand, ArgoCD will notice the drift.
ArgoCD is the most-used implementation for Kubernetes. Flux is the other.`,
      concepts: [
        ['Source of truth', 'Not the cluster, not a ticket, not a Slack thread: the Git repo. If it\'s not in Git, it\'s not real.'],
        ['Application (CRD)', 'An ArgoCD `Application` object points at a Git repo, a path, a revision — and a destination cluster/namespace. That\'s an app in Argo\'s eyes.'],
        ['Sync', 'The act of making the cluster match Git. Manual (a human clicks Sync) or automated (Argo does it on its own on every commit).'],
        ['Drift & Self-Heal', 'When cluster state diverges from Git — someone `kubectl edit`ed something — Argo reports it out of sync. With self-heal on, it reconciles automatically.'],
        ['Auto-Prune', 'When you remove a manifest from Git, do you want Argo to delete the corresponding cluster resource? auto-prune says yes; the default is no (to prevent accidents).'],
        ['App of Apps', 'A pattern: one root Application whose Git path contains other Application manifests. One click, N apps deployed. The GitOps way to bootstrap a cluster.'],
      ],
      code: `<span class="c"># An ArgoCD Application manifest</span>
<span class="k">apiVersion</span>: argoproj.io/v1alpha1
<span class="k">kind</span>: Application
<span class="k">metadata</span>:
  <span class="k">name</span>: <span class="s">api</span>
  <span class="k">namespace</span>: <span class="s">argocd</span>
<span class="k">spec</span>:
  <span class="k">project</span>: <span class="s">default</span>
  <span class="k">source</span>:
    <span class="k">repoURL</span>: <span class="s">https://github.com/acme/deploy.git</span>
    <span class="k">path</span>: <span class="s">apps/api/prod</span>
    <span class="k">targetRevision</span>: <span class="s">HEAD</span>
  <span class="k">destination</span>:
    <span class="k">server</span>: <span class="s">https://kubernetes.default.svc</span>
    <span class="k">namespace</span>: <span class="s">prod</span>
  <span class="k">syncPolicy</span>:
    <span class="k">automated</span>: { <span class="k">prune</span>: <span class="n">true</span>, <span class="k">selfHeal</span>: <span class="n">true</span> }`,
      codeCap: 'This app watches deploy.git for changes and mirrors them into the prod namespace — pruning removed resources and healing drift.',
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
      part: 4,
      num: '19',
      title: 'Monitoring & Observability',
      tag: 'You cannot fix what you cannot see. Metrics, logs, and traces.',
      intro: `Monitoring answers "is the system healthy right now?"; observability answers "why is it behaving that way?" The distinction blurs in practice, and the same three signals underlie both: metrics (numbers over time), logs (structured events), and traces (the path a request took across services).
The reference open-source stack in 2026 is Prometheus for metrics, Grafana for dashboards, Loki for logs, and Tempo (or Jaeger) for traces.`,
      concepts: [
        ['Metrics', 'Time series of numbers: request rate, error rate, latency percentiles, CPU. Cheap to store, great for alerting, poor for high-cardinality debugging.'],
        ['Logs', 'Discrete events with context. Structured (JSON) logs are queryable; unstructured logs are grep material. Store in Loki, Elastic, or an APM.'],
        ['Traces', 'A single request\'s journey across services, split into spans. Each span has a duration, a service, and attributes. This is how you find that one slow database call inside a 40-hop request.'],
        ['SLI / SLO / SLA', 'SLI is the measurement ("% of requests under 200 ms"). SLO is the internal target ("99.9% over 30 days"). SLA is the external contract (with penalties). Alert on SLO burn rate, not raw thresholds.'],
        ['PromQL', 'Prometheus\'s query language — functional, over time series. `rate(http_requests_total[5m])`, `histogram_quantile(0.99, sum(rate(...)) by (le))`.'],
        ['Pull vs Push', 'Prometheus pulls: it scrapes `/metrics` endpoints on a schedule. Pushgateway is the exception, for short-lived jobs that die before a scrape can find them.'],
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
        ['Disk & filesystems', "<code>df -h</code> shows filesystem free space, <code>du -sh *</code> shows disk use per directory, <code>ncdu</code> is the interactive tool worth installing. <code>mount</code>, <code>/etc/fstab</code> for persistent mounts. Full disk on a server is the #1 outage cause the tools above prevent."],
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
      tag: 'The front door of a production system — TLS, load balancing, caching, before your app sees a byte.',
      intro: "A reverse proxy sits in front of your servers and accepts traffic on their behalf — terminating TLS, load-balancing across replicas, caching responses, adding headers, rate-limiting abusive clients. It is the piece of the stack a request from the internet talks to first.\nNginx has been the default reverse proxy for over a decade; Caddy makes automatic HTTPS trivial; HAProxy is what you reach for when you need serious TCP-level load balancing.",
      concepts: [
        ['Reverse proxy', 'A proxy that receives client requests and forwards them to backend servers. The client only knows the proxy; the backend only knows the proxy. Opposite of a forward proxy, which represents the client to the server.'],
        ['Load balancing', 'Distributing requests across a pool of backends. Algorithms: round-robin, least-connections, ip-hash (sticky sessions), weighted (heterogeneous fleets).'],
        ['TLS termination', 'The proxy decrypts HTTPS once, at the edge, and speaks plain HTTP to internal backends. Centralises cert management.'],
        ['Upstream', "Nginx term for a named group of backends behind a <code>proxy_pass</code>. Define once, reference from many <code>server</code> blocks."],
        ['Health checks', 'Active probes that remove failing backends from the pool. Not free in open-source nginx — Plus tier or an external check.'],
        ['Caddy & HAProxy', "Caddy: modern Go server whose killer feature is automatic HTTPS via Let’s Encrypt with essentially no config. HAProxy: high-performance TCP/HTTP load balancer, the classic choice at scale."],
      ],
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
      tag: 'The handshake that makes HTTPS actually secure — and the certificate that anchors it.',
      intro: "TLS is what makes HTTPS actually secure — a handshake at the start of a TCP connection that establishes an encrypted, authenticated channel. SSL is TLS’s predecessor; the names are used interchangeably out of habit, though every current implementation is TLS.\nThe core object is the certificate: a public key bound to an identity (a domain name), signed by a certificate authority the browser already trusts.",
      concepts: [
        ['Certificate', 'A public key plus metadata (subject, issuer, validity dates, SANs) signed by a CA. Public. The private key stays on your server.'],
        ['Certificate chain', 'Server cert → intermediate CA → root CA. You serve the server + intermediates; the client has the root pre-installed.'],
        ['Let’s Encrypt & ACME', 'A free, automated CA. Its protocol (ACME) lets clients like certbot or your reverse proxy obtain and renew 90-day certs without human intervention.'],
        ['SNI', 'Server Name Indication. A TLS extension that lets the client tell the server which hostname it wants during the handshake, so one IP can serve many domains.'],
        ['mTLS', 'Mutual TLS. Both sides present certificates — the client authenticates to the server too. Common inside service meshes and for machine-to-machine APIs.'],
        ['Rotation', 'Certificates expire. Automate renewal (cert-manager on K8s, certbot on VMs). A production outage from an expired cert is embarrassing and preventable.'],
      ],
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
      tag: 'Joining networks that shouldn’t naturally see each other — safely, and at scale.',
      intro: "Once your infrastructure spans more than one place — cloud + on-prem, two regions, a mix of accounts — you need networking that stitches them. VPNs give you encrypted tunnels between networks or from a laptop into a network. BGP is how the internet (and every big cloud) exchanges routes. VPC design decides who can reach what.\nMost outages at scale end up here: a route missing, a peering broken, a security group too tight, a NAT gateway blowing the egress budget.",
      concepts: [
        ['VPN types', 'Site-to-site: two networks joined (offices, cloud ↔ on-prem). Client VPN: an individual device joining a network (WireGuard, OpenVPN, IPsec).'],
        ['WireGuard', 'A modern minimal VPN protocol — small kernel implementation, fast, uses public-key crypto. Increasingly the default choice.'],
        ['BGP', 'Border Gateway Protocol. How autonomous systems (ASes) on the internet exchange reachability. Cloud transit gateways speak BGP; large enterprises run it internally.'],
        ['VPC / VNet', 'Virtual Private Cloud (AWS/GCP) or VNet (Azure). An isolated network in your cloud account, sliced into subnets.'],
        ['VPC peering & Transit Gateway', 'Peering: point-to-point link between two VPCs. Transit Gateway / Hub-VNet: a hub that connects many VPCs and on-prem networks with a single routing table.'],
        ['NAT & egress cost', 'A NAT gateway lets private-subnet resources reach the internet without being reachable from it. In AWS it is priced per-GB — a shockingly common bill line.'],
      ],
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
      num: '12',
      title: 'Git — Beyond the Basics',
      tag: 'rebase, cherry-pick, bisect, reflog — the tools that make git feel like a lever, not a chore.',
      intro: "Everyone knows commit and push. Where teams diverge in productivity is what happens next: how they handle history, how they recover from mistakes, and how they resolve the inevitable conflicts.\nThis chapter is the second layer of git — rebase, cherry-pick, bisect, reflog, hooks — the tools that separate a fluent user from someone who fights the tool.",
      concepts: [
        ['rebase vs merge', 'Merge joins two branches with a merge commit, preserving history. Rebase replays your commits on top of another branch for linear history. Merge for shared long-lived branches; rebase for your own before pushing.'],
        ['Interactive rebase', '<code>git rebase -i main</code> opens an editor letting you squash, reorder, edit, reword, or drop commits before they are published. The way to clean up a messy branch.'],
        ['cherry-pick', 'Copy a specific commit from another branch onto the current one. Useful for hot-fixing an older release with a fix that landed on main.'],
        ['bisect', 'A binary search over history to find the commit that introduced a bug. Mark good and bad; git checks out midpoints; you test and mark; git narrows it down.'],
        ['reflog', "A log of everywhere HEAD has been. If you “lose” a commit through a reset or bad rebase, <code>git reflog</code> shows the SHA and you can recover it."],
        ['Hooks', 'Scripts git runs at points in its workflow — pre-commit (lint before committing), pre-push (run tests), commit-msg (enforce format). Managed with <code>pre-commit</code> or <code>husky</code>.'],
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
      num: '16',
      title: 'Cloud Fundamentals',
      tag: 'Regions, VPCs, subnets, security groups — the primitives every cloud provider gives you.',
      intro: "AWS, GCP, Azure look different on the surface, but their core primitives are close cousins. Understanding regions, availability zones, VPCs, subnets, security groups, and IAM is the durable knowledge — the console UIs change every quarter, these concepts don’t.\nThe biggest early wins are architectural: keep private workloads in private subnets, expose only what needs exposing, and design across AZs so a single-datacentre failure doesn’t take you out.",
      concepts: [
        ['Region & Availability Zone', 'Region: a geographic area (eu-west-1, us-central1). AZ: an isolated datacentre within a region. Multi-AZ = resilience; multi-region = disaster recovery.'],
        ['VPC / VNet', 'Your own isolated network in the cloud account. Choose a CIDR block (e.g., 10.0.0.0/16). Everything you provision lives inside one.'],
        ['Subnets (public / private)', 'A slice of a VPC. Public subnets have a route to an internet gateway; private subnets do not. Databases go in private; load balancers in public.'],
        ['Security Groups vs NACLs', 'Security Group: a stateful firewall attached to an instance or ENI (return traffic is auto-allowed). NACL: a stateless firewall at the subnet boundary. SGs are the everyday tool.'],
        ['Storage tiers', 'Object (S3, GCS, Azure Blob) for unstructured blobs and static sites. Block (EBS, Persistent Disks) for VM disks. File (EFS, Filestore) for shared POSIX filesystems.'],
        ['Managed services', 'RDS, Cloud SQL, MSK, Cloud Run, Fargate. Trade some control for someone else operating the boring parts. Almost always worth it early.'],
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
      num: '17',
      title: 'RBAC, IAM & Access Control',
      tag: 'Who can do what, to which resource, under which conditions.',
      intro: "Access control decides who can do what to which resource. RBAC — Role-Based Access Control — is the dominant model in cloud and Kubernetes: grant permissions to roles, assign roles to principals, never grant permissions to principals directly.\nCloud platforms model the same primitives — principals, permissions, resources, policies — under the name IAM. AWS IAM, GCP IAM, Azure Entra all do the same job with different words.",
      concepts: [
        ['Principal', 'The “who” — a user, group, service account, or workload identity. Cloud resources authenticate as principals.'],
        ['Role', 'A named bundle of permissions. Attached to principals. Permissions are never granted directly in a mature system.'],
        ['Permission / Verb', "The “what” — get, list, create, update, delete. Kubernetes RBAC verbs; IAM actions like <code>s3:PutObject</code>."],
        ['Resource', "The “which” — a specific bucket, a namespace, a database, a Secret. Policies match on ARNs (AWS) or API groups + resource names (K8s)."],
        ['Least privilege', 'Grant only what the principal needs. Overly-broad roles are how one compromised credential becomes a whole-account breach.'],
        ['Service accounts & workload identity', 'Non-human identities for workloads. Pods get one; Lambdas get one; CI runners get one. Prefer workload identity (IRSA, GKE Workload Identity, Azure Managed Identity) over long-lived static credentials.'],
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
      num: '18',
      title: 'Databases, Migrations & Proxies',
      tag: 'Scaling around the database — pools, replicas, migrations, and the tools that hide the seams.',
      intro: "Databases don’t scale by scaling the database process — they scale by scaling around it: read replicas for read load, connection pools to keep the number of open connections sane, and proxies like ProxySQL or PgBouncer that sit between your app and the database managing both.\nAlongside all that is schema migrations: how you change the shape of a running database without downtime.",
      concepts: [
        ['Connection pooling', 'Every DB connection costs the server memory and a backend process. Applications open pools of a fixed size and reuse connections rather than reconnecting per request.'],
        ['ProxySQL', 'A MySQL-aware proxy that pools connections, routes reads to replicas, hides failovers, and enforces query rules. Speaks the MySQL wire protocol.'],
        ['PgBouncer', 'The equivalent for PostgreSQL. Three pool modes — session, transaction, statement — trading persistence for concurrency.'],
        ['Read replica', 'A follower database that receives a live stream of writes from the primary. Reads can be served from replicas; writes always go to the primary. Beware replication lag.'],
        ['Migrations', 'Versioned schema changes tracked in order. Forward-safe pattern: add nullable column → backfill → flip to NOT NULL. Tools: Flyway, Liquibase, Alembic, Rails, sqlx.'],
        ['phpMyAdmin & admin UIs', 'phpMyAdmin: long-standing web UI for MySQL/MariaDB. Adminer, pgAdmin, DBeaver play the same role. Great for ad-hoc queries — never expose them to the internet unauthenticated.'],
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
      tag: 'A firewall for HTTP, and the OWASP top-10 it exists to blunt.',
      intro: "A Web Application Firewall inspects HTTP traffic before it reaches your app, dropping requests that look like classic attacks — SQL injection, XSS, command injection, path traversal — and rate-limiting abusive clients.\nA WAF is not a substitute for writing safe code (parameterised queries, output encoding, CSRF tokens, secure cookies), but it is a durable, effective second layer. The dominant options are Cloudflare WAF, AWS WAF, GCP Cloud Armor, and open-source ModSecurity with the OWASP Core Rule Set.",
      concepts: [
        ['WAF', 'A firewall that understands HTTP — it inspects method, path, headers, and body against rulesets, blocking or challenging suspicious traffic.'],
        ['OWASP Top 10', 'The most common web application vulnerability classes: injection, broken auth, sensitive data exposure, XXE, broken access control, misconfiguration, XSS, deserialisation, known-vulnerable components, insufficient logging.'],
        ['SQL Injection', 'Coercing a database into running attacker-supplied SQL by concatenating input into queries. Fix: parameterised queries, never string-build SQL.'],
        ['XSS', 'Cross-Site Scripting: injecting script that runs in another user’s browser session. Fix: output encoding, Content Security Policy, HttpOnly cookies.'],
        ['CSRF', "Cross-Site Request Forgery: tricking a logged-in user’s browser into making a request using their own cookies. Fix: SameSite cookies + CSRF tokens on state-changing requests."],
        ['Rate limiting & bot management', 'Cap requests per IP / per token / per route. Modern WAFs also fingerprint suspicious clients and challenge them (CAPTCHA, JS challenge) instead of blocking outright.'],
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
      tag: 'HTTP methods, status codes, SDKs — and when to reach for SSE vs WebSocket vs plain polling.',
      intro: "Almost everything modern software does across a network is an API call. Understanding HTTP semantics, the difference between an SDK and the raw API, and knowing when to reach for WebSocket vs Server-Sent Events vs plain polling will save you from a lot of avoidable pain.\nA well-designed API is boring and predictable — that is the compliment.",
      concepts: [
        ['REST', 'An architectural style for HTTP APIs: resources at URLs, verbs by HTTP method, state in the response body. Not a spec, a set of conventions. GraphQL and gRPC are alternatives with different trade-offs.'],
        ['HTTP methods', 'GET (read, safe, idempotent), POST (create, not idempotent), PUT (upsert, idempotent), PATCH (partial update), DELETE (remove, idempotent). “Idempotent” = same effect if called twice.'],
        ['Status codes', '200 OK, 201 Created, 204 No Content; 301/302 redirects; 400 Bad Request, 401 Unauthorized (unauthenticated), 403 Forbidden (authenticated but not allowed), 404 Not Found, 409 Conflict, 429 Too Many Requests; 500 Internal, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.'],
        ['SDK vs API', 'The API is the network contract. The SDK is a client library in your language that wraps it — handles auth, retries, pagination, typed responses. Prefer SDKs when they exist.'],
        ['Server-Sent Events (SSE)', 'A one-way HTTP stream from server to client. Server writes text/event-stream chunks; the browser’s EventSource re-connects automatically. Ideal for LLM token streaming, notifications, live dashboards.'],
        ['WebSocket', 'A two-way persistent connection over a single TCP socket. Use when the client also pushes frequently — chat, collab editors, games. More complex than SSE; worth it when you truly need bidirectionality.'],
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
      part: 5,
      num: '25',
      title: 'MCP — Model Context Protocol',
      tag: 'A standard for giving LLM agents tools, resources, and prompts to work with.',
      intro: "The Model Context Protocol (MCP) is an open standard, driven originally by Anthropic and now supported broadly, for connecting LLM applications to external tools and data. It defines a client-server protocol: an MCP server exposes tools (things the model can invoke), resources (things the model can read), and prompts (reusable prompt templates), and an MCP client (like Claude Desktop or Claude Code) discovers and uses them.\nBefore MCP, every agent-tool integration was ad-hoc. MCP does for LLM tool-use what LSP did for editor language support: one server implementation, every client benefits.",
      concepts: [
        ['MCP', 'Model Context Protocol — an open specification for exposing tools, resources, and prompts to LLM clients over a standard interface (JSON-RPC, stdio or streamable HTTP).'],
        ['Server', 'A program that speaks MCP and offers capabilities to a model. Servers exist for filesystems, git, Slack, Postgres, Jira, GitHub — a growing catalogue.'],
        ['Client', 'The application driving the model — Claude Desktop, Claude Code, IDE plugins. It launches or connects to MCP servers and surfaces their capabilities to the model.'],
        ['Tools', 'Functions the model can invoke with typed parameters and get typed results. The most-used surface of MCP.'],
        ['Resources', "Read-only content the model can reference — files, database rows, wiki pages — addressed by URI. Not invoked; just … there for context."],
        ['Prompts', 'Reusable prompt templates a server exposes. The client can offer them to the user as slash commands or menu items.'],
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
      num: '13',
      title: 'Service Mesh',
      tag: 'A dedicated layer for service-to-service concerns — mTLS, retries, observability — moved out of the app.',
      intro: "A service mesh is infrastructure that handles the concerns every service in a distributed system has to solve: mutual TLS between services, retries, timeouts, load balancing, traffic splitting, and per-request telemetry. It does this by injecting a proxy (a sidecar) beside each application pod, so the app itself stays boring.\nIstio and Linkerd are the two mainstream implementations on Kubernetes. You don't need a mesh on day one — you probably need one when hand-rolled retries and cross-service auth start feeling like a full-time job.",
      concepts: [
        ['Sidecar', 'A helper container running alongside your application container in the same Pod. In a mesh, the sidecar is the mesh data-plane proxy (usually Envoy) intercepting all in/out traffic.'],
        ['Data plane vs control plane', 'Data plane: the sidecar proxies handling actual traffic. Control plane: the mesh brain (istiod, Linkerd controller) that configures the proxies, distributes certs, aggregates telemetry.'],
        ['mTLS everywhere', 'The mesh mints a certificate for every service identity and requires mutual TLS between sidecars. Suddenly all inter-service traffic is authenticated and encrypted, without touching the app.'],
        ['Traffic policies', 'Retries, timeouts, circuit breakers, canary splits (10% v2, 90% v1), mirroring (send a copy to v2, use v1). Declared as CRDs (VirtualService, DestinationRule, HTTPRoute).'],
        ['Golden telemetry', 'Because every request passes through a sidecar, the mesh emits uniform metrics, distributed traces, and access logs across every service — for free.'],
        ['Cost', 'A sidecar per pod is real: extra memory per pod, an extra hop per request, a control plane to operate. Meshes are worth it at scale; overkill for two microservices.'],
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
      tag: 'Loose-coupling services through a broker — buffer the spikes, absorb the failures, unlock async work.',
      intro: "Once your system has more than one service, sooner or later you need one to hand work to another without blocking on it. A message queue or event stream sits between them: the producer publishes; the broker durably stores; the consumer pulls when ready. Slow consumer? The queue absorbs the difference. Consumer crashed? The queue keeps the messages.\nRabbitMQ and Redis are classic queues for job/task work. Kafka is the streaming heavyweight for high-throughput event logs. SQS and Pub/Sub are the managed cloud equivalents.",
      concepts: [
        ['Producer / Consumer', 'The producer publishes messages; the consumer reads them. Neither knows how many of the other exist. Add more consumers to scale processing.'],
        ['Queue vs Topic', 'Queue: each message is delivered to exactly one consumer (classic work distribution). Topic (pub/sub): every subscriber gets every message. Kafka topics are technically a hybrid — partitioned logs with consumer groups.'],
        ['At-least-once delivery', 'The default guarantee in most brokers: a message will be delivered one or more times. Consumers must be idempotent — process(msg) twice should equal process(msg) once.'],
        ['Backpressure', 'When consumers can\'t keep up, the queue grows. Alert on queue depth; scale consumers or shed load. Queues buffer bursts, they don\'t create free capacity.'],
        ['Kafka partitions & offsets', 'A Kafka topic is split into partitions (parallelism unit). Each consumer group tracks an offset per partition — where it has read to. Offsets survive restarts.'],
        ['Dead-letter queues', 'A dedicated queue for messages that repeatedly fail. Rather than blocking the main queue forever, poison messages get parked for investigation.'],
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
      tag: 'Serving the same answer twice is expensive — cache it once, close to the user.',
      intro: "Almost every performance problem in a mature system is solvable with the right cache in the right place. HTTP caching at the browser, edge caching at the CDN, application caching in Redis or Memcached, query caching in the database — each layer serves a different kind of repeat work.\nThe hard part of caching isn't writing to the cache. It's invalidating it: knowing when the cached answer is stale.",
      concepts: [
        ['Cache hierarchy', 'Browser cache → CDN edge cache → reverse-proxy cache → application cache → database. Each layer catches a wider audience but has a longer invalidation cycle.'],
        ['CDN', 'Content Delivery Network — a global fleet of edge servers (Cloudflare, CloudFront, Fastly) that cache your responses close to the user. Essential for static assets; increasingly used for API responses too.'],
        ['Redis vs Memcached', 'Redis: rich data structures (lists, sets, hashes, sorted sets), pub/sub, persistence. Memcached: pure in-memory key-value, dead simple, extremely fast. Redis is the default modern choice.'],
        ['TTL', 'Time-To-Live. Every cached item has an expiry. Short TTLs = fewer stale reads, more misses. Long TTLs = fewer misses, more staleness. Tune per data class.'],
        ['Cache-Control headers', 'HTTP\'s built-in cache language: <code>Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=60</code>. Learn it and CDNs suddenly do exactly what you want.'],
        ['Invalidation', 'The hard problem. Strategies: TTL only, event-driven purge, versioned URLs (/static/app-abc123.js), stale-while-revalidate. Choose per data type.'],
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
      tag: 'Where API keys, DB passwords, and certificates actually belong — and how they get to the app.',
      intro: "Secrets — API tokens, database passwords, TLS keys, cloud credentials — never belong in git, in Docker images, or in plaintext on shared filesystems. A proper secrets manager stores them encrypted, gates access with fine-grained policies, audits every read, and rotates them on a schedule.\nThe canonical open-source choice is HashiCorp Vault. Every major cloud has an equivalent: AWS Secrets Manager, GCP Secret Manager, Azure Key Vault. For GitOps flows, sealed-secrets and SOPS keep encrypted secrets safely in git.",
      concepts: [
        ['Secrets manager', 'A service that stores secrets encrypted at rest, authenticates and authorises callers, and audits every access. Vault, AWS/GCP/Azure Secret Manager, HashiCorp Vault, Bitwarden Secrets Manager.'],
        ['Sealed-secrets', 'A Kubernetes controller that encrypts Secret manifests with a public key, so the ciphertext is safe to commit to git. Only the controller (with the private key) can decrypt at apply time.'],
        ['SOPS', "Mozilla\'s Secrets OPerationS: encrypts values inside YAML/JSON/env files using KMS, GPG, or age. Files stay readable-structured; individual values are ciphertext. Popular in the Flux ecosystem."],
        ['Dynamic secrets', 'A killer Vault feature: on demand, Vault creates a fresh, short-lived database user for the caller and hands over its credentials. When the lease expires, Vault revokes the user. No long-lived DB passwords.'],
        ['Rotation', 'Automatically rolling secrets on a schedule — Vault does it for many secret types, cloud services do it for their own credentials. A secret that never rotates is a secret waiting to leak.'],
        ['Least privilege for secrets', 'Every secret gets a policy: which principals may read it, from where, when. Grant per-secret access, not blanket admin.'],
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
  ];

