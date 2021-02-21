var agentUrl = '',
  salesmanUrl = '',
  clientId = '';

if (process.env.NODE_ENV === 'development') {
  agentUrl = 'https://testagent.xiaopangche.cn:30001';
  salesmanUrl = 'https://testsalesman.xiaopangche.cn:30001';
  clientId = '89221a78b14f4032aba97ae27ea5225b';

  // agentUrl = 'https://agent.xiaopangche.cn';
} else {
  agentUrl = window.g.agentUrl
  salesmanUrl = window.g.salesmanUrl
  clientId = window.g.clientId
}

export {
  agentUrl,
  salesmanUrl,
  clientId
}