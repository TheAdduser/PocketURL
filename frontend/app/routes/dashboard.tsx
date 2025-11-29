import { CornerDownRight, MousePointerClickIcon } from "lucide-react";

const mockData = [
  { shortLink: "498c7b11", longLink: "github.com", clicks: 4 },
  { shortLink: "139cy8h3", longLink: "google.com", clicks: 16 },
  { shortLink: "1249c7nr", longLink: "youtube.com", clicks: 0 },
  { shortLink: "3209vh1c", longLink: "facebook.com", clicks: 41231 },
];

export default function Dashboard() {
  const getIconLink = (longLink: string) => {
    return `https://favicone.com/${longLink}?s=32`;
  };
  return (
    <div className="bg-muted h-screen w-screen">
      <div className="bg-background border-4 rounded-2xl h-screen p-8">
        <h1 className="text-2xl">Dashboard</h1>
        {mockData.length ? (
          <div className="border-2 rounded-2xl">
            {[...mockData, ...mockData, ...mockData].map((link) => (
              <div className="border-b-2 py-2 px-4 grid grid-cols-[1fr_min-content]">
                <div className="flex gap-8">
                  <img src={getIconLink(link.longLink)} className="h-8 w-8" />
                  <div className="flex flex-col">
                    <span>Shorther.com/{link.shortLink}</span>
                    <div className="flex gap-2 items-center">
                      <CornerDownRight
                        color="var(--ring)"
                        width={16}
                        height={16}
                      />
                      <span>{link.longLink}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 border-2 rounded-md px-2 py-1 items-center">
                  <span className="whitespace-nowrap">{link.clicks} clicks</span>
                  <MousePointerClickIcon />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
