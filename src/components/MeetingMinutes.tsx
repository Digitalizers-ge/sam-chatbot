
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Users, Clock, Mail, MessageSquare, Copy } from 'lucide-react';
import { Message } from '@/pages/Meeting';
import { useToast } from '@/hooks/use-toast';

interface MeetingMinutesProps {
  messages: Message[];
}

export const MeetingMinutes = ({ messages }: MeetingMinutesProps) => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [attendees, setAttendees] = useState('');
  const { toast } = useToast();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateMinutes = () => {
    const currentDate = new Date().toLocaleDateString();
    const startTime = messages.length > 0 ? formatTime(messages[0].timestamp) : '';
    const endTime = messages.length > 0 ? formatTime(messages[messages.length - 1].timestamp) : '';
    
    let minutes = `MEETING MINUTES\n\n`;
    minutes += `Title: ${meetingTitle || 'Untitled Meeting'}\n`;
    minutes += `Date: ${currentDate}\n`;
    minutes += `Time: ${startTime} - ${endTime}\n`;
    minutes += `Attendees: ${attendees || 'User 1, User 2'}\n\n`;
    minutes += `DISCUSSION SUMMARY:\n\n`;

    messages.forEach((message, index) => {
      const speaker = message.speaker === 'user1' ? 'User 1' : 'User 2';
      minutes += `[${formatTime(message.timestamp)}] ${speaker}: ${message.text}\n\n`;
    });

    return minutes;
  };

  const downloadMinutes = () => {
    const minutes = generateMinutes();
    const blob = new Blob([minutes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-minutes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendByEmail = () => {
    const minutes = generateMinutes();
    const subject = encodeURIComponent(`Meeting Minutes - ${meetingTitle || 'Untitled Meeting'}`);
    const body = encodeURIComponent(minutes);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const sendBySMS = () => {
    const minutes = generateMinutes();
    const truncatedMinutes = minutes.length > 160 ? minutes.substring(0, 157) + '...' : minutes;
    const smsLink = `sms:?body=${encodeURIComponent(truncatedMinutes)}`;
    window.open(smsLink);
  };

  const usefulLinks = [
    { label: 'SAM Translation Hub', url: 'https://samtranslation.com' },
    { label: 'Meeting Best Practices', url: 'https://example.com/meeting-practices' },
    { label: 'Language Support', url: 'https://example.com/language-support' },
    { label: 'Technical Documentation', url: 'https://docs.samtranslation.com' },
    { label: 'Contact Support', url: 'https://support.samtranslation.com' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Link has been copied to your clipboard.",
    });
  };

  const getStats = () => {
    const user1Messages = messages.filter(m => m.speaker === 'user1').length;
    const user2Messages = messages.filter(m => m.speaker === 'user2').length;
    const duration = messages.length > 1 
      ? Math.round((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / 60000)
      : 0;

    return { user1Messages, user2Messages, duration };
  };

  const stats = getStats();

  return (
    <div className="sam-glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Meeting Minutes</h2>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Meeting Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Meeting Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Meeting Title</label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Enter meeting title..."
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Attendees</label>
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="User 1, User 2"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Meeting Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Meeting Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">User 1 Messages:</span>
              <span className="font-medium">{stats.user1Messages}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">User 2 Messages:</span>
              <span className="font-medium">{stats.user2Messages}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duration:
              </span>
              <span className="font-medium">{stats.duration} min</span>
            </div>
          </CardContent>
        </Card>

        {/* Useful Links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Useful Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {usefulLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{link.label}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(link.url)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t space-y-2">
        <Button 
          onClick={downloadMinutes}
          disabled={messages.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Minutes
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={sendByEmail}
            disabled={messages.length === 0}
            variant="outline"
            className="text-sm"
          >
            <Mail className="w-4 h-4 mr-1" />
            Send By Email
          </Button>
          <Button 
            onClick={sendBySMS}
            disabled={messages.length === 0}
            variant="outline"
            className="text-sm"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Send by SMS
          </Button>
        </div>
      </div>
    </div>
  );
};
