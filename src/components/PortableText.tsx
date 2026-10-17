import type { BlogBodyBlock } from "../lib/blog";

type Props = {
  blocks: BlogBodyBlock[];
};

export default function PortableText({ blocks }: Props) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <Block key={block._key ?? index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: BlogBodyBlock }) {
  switch (block._type) {
    case "image":
      return <ImageBlock block={block} />;
      
    case "youtube":
      return <YoutubeBlock block={block} />;

    case "block":
    default:
      return <TextBlock block={block} />;
  }
}

/* ------------------------------------------------------------------ */
/* YouTube block                                                       */
/* ------------------------------------------------------------------ */

function getYouTubeId(url?: string) {
  if (!url) return null;
  // Matches: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID, etc.
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function YoutubeBlock({ block }: { block: BlogBodyBlock }) {
  const videoId = getYouTubeId(block.url);
  if (!videoId) return null;

  return (
    <figure className="my-10">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-cyber-purple/20 bg-cyber-card shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={block.title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      {block.title && (
        <figcaption className="mt-3 text-center font-mono text-xs uppercase tracking-widest text-gray-500">
          {block.title}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Text block: paragraph, heading, blockquote, list item              */
/* ------------------------------------------------------------------ */

function TextBlock({ block }: { block: BlogBodyBlock }) {
  const children = renderChildren(block);

  if (block.listItem === "bullet") {
    return (
      <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-300 marker:text-cyber-purple">
        <li>{children}</li>
      </ul>
    );
  }

  if (block.listItem === "number") {
    return (
      <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed text-gray-300 marker:text-cyber-purple">
        <li>{children}</li>
      </ol>
    );
  }

  switch (block.style) {
    case "h1":
      return (
        <h1 className="mt-12 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className="mt-6 font-display text-lg font-bold tracking-tight text-white">
          {children}
        </h4>
      );
    case "blockquote":
      return (
        <blockquote className="border-l-2 border-cyber-purple/50 pl-6 text-lg italic leading-relaxed text-gray-300">
          {children}
        </blockquote>
      );
    default:
      return (
        <p className="text-base leading-relaxed text-gray-300">{children}</p>
      );
  }
}

function renderChildren(block: BlogBodyBlock) {
  if (!block.children || block.children.length === 0) return null;

  return block.children.map((child, i) => {
    let node: React.ReactNode = child.text ?? "";

    // Apply marks in order
    if (child.marks && child.marks.length > 0) {
      for (const mark of child.marks) {
        if (mark === "strong") node = <strong key={i}>{node}</strong>;
        else if (mark === "em") node = <em key={i}>{node}</em>;
        else if (mark === "code")
          node = (
            <code
              key={i}
              className="rounded bg-cyber-card px-1.5 py-0.5 font-mono text-sm text-cyber-purple"
            >
              {node}
            </code>
          );
        else if (mark === "underline")
          node = <span key={i} className="underline">{node}</span>;
        else {
          // Link — look up in markDefs
          const def = block.markDefs?.find((d) => d._key === mark);
          if (def && def._type === "link" && def.href) {
            const isExternal = /^https?:\/\//.test(def.href);
            node = (
              <a
                key={i}
                href={def.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-cyber-purple underline decoration-cyber-purple/40 underline-offset-4 transition-colors hover:decoration-cyber-purple"
              >
                {node}
              </a>
            );
          }
        }
      }
    }

    return <span key={child._key ?? i}>{node}</span>;
  });
}

/* ------------------------------------------------------------------ */
/* Image block                                                        */
/* ------------------------------------------------------------------ */

function ImageBlock({ block }: { block: BlogBodyBlock }) {
  if (!block.imageUrl) return null;

  return (
    <figure className="my-10">
      <div className="overflow-hidden rounded-2xl border border-cyber-purple/20">
        <img
          src={`${block.imageUrl}?w=1200&auto=format`}
          alt={block.alt ?? ""}
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-3 text-center font-mono text-xs uppercase tracking-widest text-gray-500">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}