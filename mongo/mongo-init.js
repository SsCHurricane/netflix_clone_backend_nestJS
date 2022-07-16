db.createUser({
  user: 'hurricane',
  pwd: '12345678',
  roles: [
    {
      role: 'readWrite',
      db: 'netflix-clone',
    },
  ],
});
