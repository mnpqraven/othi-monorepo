import * as React from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <div className="border rounded-md p-2 bg-red-300">
      <a
        className={className}
        href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <h2>
          {title} <span>-&gt;</span>
        </h2>
        <p>{children}</p>
      </a>
    </div>
  );
}
