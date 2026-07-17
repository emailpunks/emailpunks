const CACHE_SECONDS = 300;

exports.handler = async () => {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing Instagram credentials' }),
    };
  }

  const fields =
    'id,caption,media_url,permalink,thumbnail_url,media_type,timestamp';
  const url = `https://graph.facebook.com/v21.0/${userId}/media?fields=${fields}&limit=8&access_token=${token}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
