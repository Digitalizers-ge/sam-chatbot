
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Folder, Download } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  html_url: string;
  size?: number;
}

const Docs = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [pathHistory, setPathHistory] = useState<string[]>(['']);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchFiles = async (path: string = '') => {
    setLoading(true);
    try {
      const url = `https://api.github.com/repos/Digitalizers-ge/sam-chatbot/contents/${path}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      setFiles(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch files from GitHub repository",
        variant: "destructive"
      });
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
    setPathHistory(prev => [...prev, path]);
  };

  const navigateBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = pathHistory.slice(0, -1);
      setPathHistory(newHistory);
      setCurrentPath(newHistory[newHistory.length - 1]);
    }
  };

  const downloadFile = async (file: GitHubFile) => {
    if (file.download_url) {
      window.open(file.download_url, '_blank');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen sam-gradient-bg">
      {/* Header */}
      <div className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          
          <div className="flex flex-col items-center py-8">
            <div className="flex flex-col items-center mb-6">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <img src="/lovable-uploads/22846939-a307-4be2-b1d0-39a60a6cf0de.png" alt="SAM Logo" className="h-36 w-auto mb-2" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
              <p className="text-lg text-gray-600 text-center">Browse files from the SAM Chatbot repository</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Repository Files
              </CardTitle>
              {currentPath && (
                <Button
                  onClick={navigateBack}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to parent
                </Button>
              )}
            </div>
            {currentPath && (
              <p className="text-sm text-gray-600">Current path: /{currentPath}</p>
            )}
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No files found in this directory
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {file.type === 'dir' ? (
                        <Folder className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        {file.size && (
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {file.type === 'dir' ? (
                        <Button
                          onClick={() => navigateToFolder(file.path)}
                          variant="outline"
                          size="sm"
                        >
                          Open
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => window.open(file.html_url, '_blank')}
                            variant="outline"
                            size="sm"
                          >
                            View
                          </Button>
                          {file.download_url && (
                            <Button
                              onClick={() => downloadFile(file)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Docs;
