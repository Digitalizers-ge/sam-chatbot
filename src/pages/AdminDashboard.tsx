
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, MessageSquare, Globe, BarChart3, Search, Filter, Upload, FileText, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useKPIs } from '@/hooks/useKPIs';
import { NavigationMenu } from '@/components/NavigationMenu';
import { supabase } from '@/integrations/supabase/client';

interface ConversationMessage {
  id: string;
  timestamp: Date;
  userCountry: string | null;
  language: string;
  userMessage: string;
  assistantMessage: string | null;
  sessionId: string;
  flagged: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { kpis, loading } = useKPIs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterFlagged, setFilterFlagged] = useState('all');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);

  // Fetch conversations from database
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setConversationsLoading(true);
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Error fetching conversations:', error);
          return;
        }

        const formattedConversations: ConversationMessage[] = data.map(conv => ({
          id: conv.id,
          timestamp: new Date(conv.created_at),
          userCountry: conv.user_country,
          language: conv.language,
          userMessage: conv.user_message,
          assistantMessage: conv.assistant_message,
          sessionId: conv.session_id,
          flagged: false, // TODO: Implement flagging system
        }));

        setConversations(formattedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setConversationsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Transform KPI data for charts with real data
  const languageData = kpis?.languages.map((language) => {
    const count = conversations.filter(conv => conv.language === language).length;
    return {
      language,
      count,
      percentage: ((count / (conversations.length || 1)) * 100).toFixed(1)
    };
  }) || [];

  const countryData = Object.entries(kpis?.users_by_country || {}).map(([country, users], index) => ({
    country,
    users: Number(users),
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe'][index % 6]
  }));

  const chartConfig = {
    count: {
      label: "Usage Count",
      color: "#8884d8"
    }
  };

  const filteredMessages = conversations.filter(message => {
    const matchesSearch = message.userMessage.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (message.assistantMessage?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesLanguage = filterLanguage === 'all' || message.language === filterLanguage;
    const matchesFlagged = filterFlagged === 'all' || 
                          filterFlagged === 'flagged' && message.flagged || 
                          filterFlagged === 'not-flagged' && !message.flagged;
    return matchesSearch && matchesLanguage && matchesFlagged;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUploadSubmit = () => {
    if (uploadedFile) {
      console.log('Uploading file:', uploadedFile.name);
      alert(`File "${uploadedFile.name}" would be uploaded to train the model`);
      setUploadedFile(null);
    }
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleCreateMeeting = () => {
    const meetingId = generateRandomId();
    navigate(`/meeting?id=${meetingId}`);
  };

  if (loading || conversationsLoading) {
    return (
      <div className="min-h-screen sam-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sam-gradient-bg">
      <div className="min-h-screen bg-white/10 backdrop-blur-sm p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile-responsive header with NavigationMenu positioned correctly */}
          <div className="mb-6 md:mb-8 relative">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <img src="/lovable-uploads/22846939-a307-4be2-b1d0-39a60a6cf0de.png" alt="SAM Logo" className="h-16 md:h-24 w-auto" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                  <p className="text-sm md:text-base text-gray-600">Monitor platform usage and moderate conversations</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                <Button 
                  onClick={handleCreateMeeting}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Create a new meeting
                </Button>
                {/* Navigation is now positioned absolutely on mobile */}
                <div className="hidden md:block">
                  <NavigationMenu />
                </div>
              </div>
            </div>
            {/* Mobile navigation is now handled by the NavigationMenu component itself */}
            <NavigationMenu />
          </div>

          {/* Key Metrics - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="sam-glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{kpis?.total_questions.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">Real-time from conversations</p>
              </CardContent>
            </Card>

            <Card className="sam-glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{kpis?.active_sessions.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card className="sam-glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Questions/Session</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{kpis?.avg_questions_per_session || '0'}</div>
                <p className="text-xs text-muted-foreground">Calculated from sessions</p>
              </CardContent>
            </Card>

            <Card className="sam-glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{kpis?.active_users.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts - Mobile responsive with fixed overflow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="sam-glass">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Languages Usage</CardTitle>
                <CardDescription className="text-sm">Most used languages on the platform</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={languageData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="language" 
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />
                      <YAxis fontSize={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="sam-glass">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Users by Country</CardTitle>
                <CardDescription className="text-sm">Geographic distribution of users</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                      <Pie 
                        data={countryData} 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={window.innerWidth < 768 ? 60 : 80}
                        fill="#8884d8" 
                        dataKey="users" 
                        label={({ country, users }) => window.innerWidth < 768 ? `${users}` : `${country}: ${users}`}
                        fontSize={window.innerWidth < 768 ? 10 : 12}
                      >
                        {countryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Moderation - Mobile responsive */}
          <Card className="sam-glass">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Message Moderation</CardTitle>
              <CardDescription className="text-sm">Review and moderate platform conversations</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile-responsive filters */}
              <div className="flex flex-col gap-3 md:flex-row md:gap-4 mb-4 md:mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search messages..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      className="pl-10 text-sm" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
                  <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {kpis?.languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterFlagged} onValueChange={setFilterFlagged}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="flagged">Flagged Only</SelectItem>
                      <SelectItem value="not-flagged">Not Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile-responsive table */}
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Timestamp</TableHead>
                      <TableHead className="min-w-[80px]">Country</TableHead>
                      <TableHead className="min-w-[80px]">Language</TableHead>
                      <TableHead className="min-w-[200px]">User Message</TableHead>
                      <TableHead className="min-w-[200px]">Assistant Response</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map(message => (
                      <TableRow key={message.id}>
                        <TableCell className="text-xs md:text-sm">
                          {message.timestamp.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm">{message.userCountry || 'Unknown'}</TableCell>
                        <TableCell className="text-xs md:text-sm">{message.language}</TableCell>
                        <TableCell className="max-w-[150px] md:max-w-xs truncate text-xs md:text-sm">
                          {message.userMessage}
                        </TableCell>
                        <TableCell className="max-w-[150px] md:max-w-xs truncate text-xs md:text-sm">
                          {message.assistantMessage || 'No response yet'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={message.flagged ? "destructive" : "secondary"} className="text-xs">
                            {message.flagged ? "Flagged" : "Normal"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              View
                            </Button>
                            <Button variant={message.flagged ? "secondary" : "destructive"} size="sm" className="text-xs">
                              {message.flagged ? "Unflag" : "Flag"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm md:text-base">
                    No conversations found matching your filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Upload Section - Mobile responsive */}
          <Card className="mt-6 md:mt-8 sam-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
                Model Training
              </CardTitle>
              <CardDescription className="text-sm">
                Upload PDF documents to teach the model about your own contextual information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-upload" className="text-sm">Upload PDF Document</Label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Input 
                    id="pdf-upload" 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileUpload} 
                    className="flex-1 text-sm" 
                  />
                  <Button 
                    onClick={handleUploadSubmit} 
                    disabled={!uploadedFile} 
                    className="flex items-center justify-center gap-2 text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
                {uploadedFile && (
                  <p className="text-xs md:text-sm text-green-600">
                    Selected: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="context-description" className="text-sm">Context Description (Optional)</Label>
                <Textarea 
                  id="context-description" 
                  placeholder="Describe what this document contains and how it should be used by the model..." 
                  className="min-h-[80px] text-sm" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
