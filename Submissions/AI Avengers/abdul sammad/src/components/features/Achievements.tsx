import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { UserPoints } from "@/lib/types";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  achieved: boolean;
  progress: number;
}

interface AchievementsProps {
  userPoints: UserPoints;
  achievements: Achievement[];
}

export function Achievements({ userPoints, achievements }: AchievementsProps) {
  const levelProgress = (userPoints.points % 100) / 100;

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {userPoints.level}</h2>
            <p className="text-muted-foreground">
              {userPoints.points} total points earned
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Rank: Master Saver
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next level</span>
            <span>{(levelProgress * 100).toFixed(0)}%</span>
          </div>
          <Progress value={levelProgress * 100} className="h-2" />
        </div>
      </Card>

      {/* Recent Points History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {userPoints.history.slice(0, 5).map((entry, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{entry.reason}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="secondary">+{entry.points} pts</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-6 ${
              achievement.achieved ? "bg-accent/50" : "opacity-75"
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">{achievement.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{achievement.progress}%</span>
              </div>
              <Progress value={achievement.progress} />
            </div>
            {achievement.achieved && (
              <Badge className="mt-4" variant="default">
                +{achievement.points} pts earned
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}