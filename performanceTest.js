import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1000,
  iterations: 3500,
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete within 2s
  },
};

export default function () {
  // API Create
  const createPayload = JSON.stringify({
    name: 'morpheus',
    job: 'leader',
  });
  const createHeaders = {
    'Content-Type': 'application/json',
  };
  const createResponse = http.post('https://reqres.in/api/users', createPayload, { headers: createHeaders });

  check(createResponse, {
    'Create API is status 201': (response) => response.status === 201,
    'Create API returns user data': (response) => response.json('name') === 'morpheus' && response.json('job') === 'leader',
  });

  // API Update
  const updatePayload = JSON.stringify({
    name: 'morpheus',
    job: 'zion resident',
  });
  const updateHeaders = {
    'Content-Type': 'application/json',
  };
  const updateResponse = http.put('https://reqres.in/api/users', updatePayload, { headers: updateHeaders });

  check(updateResponse, {
    'Update API is status 200': (response) => response.status === 200,
    'Update API returns updated user data': (response) => response.json('name') === 'morpheus' && response.json('job') === 'zion resident',
  });

  sleep(1);
}
