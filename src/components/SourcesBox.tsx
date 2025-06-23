
import { ExternalLink, BookOpen, Scale, Globe } from 'lucide-react';

interface Source {
  title: string;
  description: string;
  url: string;
  type: 'legal' | 'resource' | 'guide' | 'official';
}

export const SourcesBox = () => {
  const sources: Source[] = [
    {
      title: "UNHCR Refugee Rights",
      description: "Official UN guide to refugee rights and protections",
      url: "https://help.unhcr.org/faq/how-can-we-help-you/rights-and-duties/",
      type: "official"
    },
    {
      title: "EU Asylum Procedures",
      description: "Common European Asylum System overview",
      url: "https://home-affairs.ec.europa.eu/policies/migration-and-asylum/asylum-eu/asylum-procedures_en",
      type: "legal"
    },
    {
      title: "Legal Aid Directory",
      description: "Find free legal assistance in your area",
      url: "https://home-affairs.ec.europa.eu/policies/migration-and-asylum/asylum-eu/asylum-procedures_en",
      type: "resource"
    },
    {
      title: "Asylum Seeker's Guide",
      description: "Step-by-step process explanation",
      url: "https://asylumineurope.org/wp-content/uploads/2020/11/aida_accessii_registration.pdf",
      type: "guide"
    },
    {
      title: "Country Information",
      description: "Specific asylum policies by country",
      url: "#",
      type: "guide"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'legal':
        return <Scale className="w-4 h-4" />;
      case 'resource':
        return <BookOpen className="w-4 h-4" />;
      case 'guide':
        return <BookOpen className="w-4 h-4" />;
      case 'official':
        return <Globe className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'legal':
        return 'bg-red-100 text-red-800';
      case 'resource':
        return 'bg-green-100 text-green-800';
      case 'guide':
        return 'bg-blue-100 text-blue-800';
      case 'official':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResourceClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="sam-glass rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sources & Resources</h2>
      
      <div className="space-y-3">
        {sources.map((source, index) => (
          <div
            key={index}
            className="bg-white/50 rounded-lg p-4 hover:bg-white/70 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getIcon(source.type)}
                <h3 className="font-medium text-gray-800 text-sm">{source.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(source.type)}`}>
                {source.type}
              </span>
            </div>
            
            <p className="text-xs text-gray-600 mb-2">{source.description}</p>
            
            <div 
              className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => handleResourceClick(source.url)}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              <span className="text-xs">View Resource</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 text-sm mb-2">Need immediate help?</h3>
        <p className="text-xs text-blue-700 mb-2">
          Contact emergency services or local refugee support organizations
        </p>
        <div className="text-xs text-blue-600">
          📞 Emergency: 112 (EU-wide)
        </div>
      </div>
    </div>
  );
};
