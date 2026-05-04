export const events = [
  {
    id: 1,
    name: "Cultural Fest 2026",
    venue: "BBC Grounds",
    date: "2026-04-15",
    currentCrowd: 30,
    capacity: 100,
    type: "cultural",
    ongoing: true,
    icon: "🎉",
    rating: 4.8
  }
];

export const getCrowdPercentage = (current, total) => {
  return Math.floor((current / total) * 100);
};

export const getCrowdLevel = (percent) => {
  if (percent < 40) return { text: "Low", color: "green", icon: "🟢" };
  if (percent < 80) return { text: "Medium", color: "orange", icon: "🟠" };
  return { text: "High", color: "red", icon: "🔴" };
};