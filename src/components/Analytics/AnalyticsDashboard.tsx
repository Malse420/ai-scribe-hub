import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsDashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  const eventCounts = analytics?.reduce((acc: Record<string, number>, curr) => {
    acc[curr.event_type] = (acc[curr.event_type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(eventCounts || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const sessionData = analytics?.map((event) => ({
    date: new Date(event.created_at || "").toLocaleDateString(),
    duration: event.session_duration || 0,
  }));

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Event Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={300} height={200} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Duration Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={300} height={200} data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="duration" stroke="#82ca9d" />
            </LineChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics?.slice(0, 5).map((event) => (
                <div key={event.id} className="p-2 border rounded">
                  <div className="font-medium">{event.event_type}</div>
                  <div className="text-sm text-gray-500">
                    {Object.entries(event.custom_dimensions || {}).map(([key, value]) => (
                      <div key={key}>
                        {key}: {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};