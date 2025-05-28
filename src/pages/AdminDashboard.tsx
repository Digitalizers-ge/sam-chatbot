import { useState } from 'react';
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
import { Users, MessageSquare, Globe, BarChart3, Search, Filter, Upload, FileText } from 'lucide-react';

// Mock data for demonstration
const keyMetrics = {
  totalQuestions: 1248,
  totalSessions: 856,
  averageQuestionsPerSession: 1.46,
  activeUsers: 342
};

const languageData = [
  { language: 'English', count: 456, percentage: 36.5 },
  { language: 'Arabic', count: 298, percentage: 23.9 },
  { language: 'French', count: 186, percentage: 14.9 },
  { language: 'German', count: 142, percentage: 11.4 },
  { language: 'Spanish', count: 98, percentage: 7.9 },
  { language: 'Other', count: 68, percentage: 5.4 }
];

const countryData = [
  { country: 'Germany', users: 145, color: '#8884d8' },
  { country: 'France', users: 98, color: '#82ca9d' },
  { country: 'Italy', users: 76, color: '#ffc658' },
  { country: 'Spain', users: 54, color: '#ff7300' },
  { country: 'Netherlands', users: 32, color: '#00ff00' },
  { country: 'Other', users: 67, color: '#0088fe' }
];

const mockMessages = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T10:30:00'),
    userCountry: 'Germany',
    language: 'English',
    userMessage: 'What are the requirements for asylum in Germany?',
    assistantMessage: 'To apply for asylum in Germany, you need to...',
    sessionId: 'session_001',
    flagged: false
  },
  {
    id: '2',
    timestamp: new Date('2024-01-15T11:15:00'),
    userCountry: 'France',
    language: 'French',
    userMessage: 'Comment puis-je faire une demande d\'asile?',
    assistantMessage: 'Pour faire une demande d\'asile en France...',
    sessionId: 'session_002',
    flagged: true
  },
  {
    id: '3',
    timestamp: new Date('2024-01-15T12:00:00'),
    userCountry: 'Italy',
    language: 'Arabic',
    userMessage: 'ما هي الوثائق المطلوبة؟',
    assistantMessage: 'الوثائق المطلوبة للجوء في إيطاليا...',
    sessionId: 'session_003',
    flagged: false
  }
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterFlagged, setFilterFlagged] = useState('all');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const chartConfig = {
    count: {
      label: "Usage Count",
      color: "#8884d8",
    },
  };

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.userMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.assistantMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || message.language === filterLanguage;
    const matchesFlagged = filterFlagged === 'all' || 
                          (filterFlagged === 'flagged' && message.flagged) ||
                          (filterFlagged === 'not-flagged' && !message.flagged);
    
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
      // Here you would implement the actual upload logic
      console.log('Uploading file:', uploadedFile.name);
      alert(`File "${uploadedFile.name}" would be uploaded to train the model`);
      setUploadedFile(null);
    }
  };

  return (
    <div className="min-h-screen sam-gradient-bg">
      <div className="min-h-screen bg-white/10 backdrop-blur-sm p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor platform usage and moderate conversations</p>
          </div>

          {/* Knowledge Upload Section */}
          <Card className="mb-8 sam-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Model Training
              </CardTitle>
              <CardDescription>
                Upload PDF documents to teach the model about your own contextual information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-upload">Upload PDF Document</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleUploadSubmit} 
                    disabled={!uploadedFile}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
                {uploadedFile && (
                  <p className="text-sm text-green-600">
                    Selected: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="context-description">Context Description (Optional)</Label>
                <Textarea
                  id="context-description"
                  placeholder="Describe what this document contains and how it should be used by the model..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="sam-glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keyMetrics.totalQuestions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="sam-glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keyMetrics.totalSessions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="sam-glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Questions/Session</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keyMetrics.averageQuestionsPerSession}</div>
                <p className="text-xs text-muted-foreground">+0.2 from last month</p>
              </CardContent>
            </Card>

            <Card className="sam-glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keyMetrics.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="sam-glass">
              <CardHeader>
                <CardTitle>Languages Usage</CardTitle>
                <CardDescription>Most used languages on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={languageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="language" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="sam-glass">
              <CardHeader>
                <CardTitle>Users by Country</CardTitle>
                <CardDescription>Geographic distribution of users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={countryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="users"
                        label={({ country, users }) => `${country}: ${users}`}
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

          {/* Message Moderation */}
          <Card className="sam-glass">
            <CardHeader>
              <CardTitle>Message Moderation</CardTitle>
              <CardDescription>Review and moderate platform conversations</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
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

              {/* Messages Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>User Message</TableHead>
                      <TableHead>Assistant Response</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="text-sm">
                          {message.timestamp.toLocaleString()}
                        </TableCell>
                        <TableCell>{message.userCountry}</TableCell>
                        <TableCell>{message.language}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {message.userMessage}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {message.assistantMessage}
                        </TableCell>
                        <TableCell>
                          <Badge variant={message.flagged ? "destructive" : "secondary"}>
                            {message.flagged ? "Flagged" : "Normal"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button 
                              variant={message.flagged ? "secondary" : "destructive"} 
                              size="sm"
                            >
                              {message.flagged ? "Unflag" : "Flag"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
