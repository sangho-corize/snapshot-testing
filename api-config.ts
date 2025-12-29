// API endpoints configuration
// Add your APIs here - the list can change anytime you need

type ApiEndpoint = {
  url: string;
  filename: string;
};

export const apiEndpoints: ApiEndpoint[] = [
  {
    url: 'https://ipinfo.io/161.185.160.93/geo',
    filename: 'ipinfo-geo.json'
  },
  {
    url: 'https://api.zippopotam.us/us/33162',
    filename: 'zippopotam-33162.json'
  },
];
