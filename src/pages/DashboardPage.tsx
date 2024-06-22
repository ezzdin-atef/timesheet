import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/database/projects";
import { FolderGit2, TentTree } from "lucide-react";
import React, { useEffect } from "react";

export default function DashboardPage() {
  const [numberOfProjects, setNumberOfProjects] = React.useState<number>(0);

  useEffect(() => {
    getProjects().then((projects) => {
      setNumberOfProjects(projects.length);
    });
  }, []);

  return (
    <div className="">
      <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 gap-6">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Annual
            </CardTitle>
            <TentTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numberOfProjects}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
