# Debugging Guide for VS Code Insiders Agent

## React Component Debugging
1. Use React DevTools extension to inspect component hierarchy
2. Check component props and state
3. Add console logs for key lifecycle events:
   ```javascript
   useEffect(() => {
     console.log('Component mounted with props:', props);
     console.log('Initial state:', state);
     
     return () => {
       console.log('Component unmounting');
     };
   }, []);
   
   useEffect(() => {
     console.log('Props or state changed:', { props, state });
   }, [props, state]);
   ```

4. Use VS Code's JavaScript debugger:
   - Add breakpoints in your code
   - Use the Debug Console to evaluate expressions
   - Step through code execution

## API Debugging
1. Use network tab in browser DevTools to inspect:
   - Request URL and headers
   - Request payload
   - Response status and data
   - Timing information

2. Add logging to API handlers:
   ```javascript
   router.get('/resource/:id', (req, res) => {
     console.log('Request params:', req.params);
     console.log('Request query:', req.query);
     console.log('Request headers:', req.headers);
     
     // Handle request...
     
     console.log('Response:', data);
     res.json(data);
   });
   ```

3. Use Postman or Insomnia to test API endpoints directly

## Database Debugging
1. Check database connection:
   ```javascript
   db.raw('SELECT 1+1 as result')
     .then(() => console.log('DB Connection successful'))
     .catch(err => console.error('DB Connection failed:', err));
   ```

2. Log SQL queries:
   ```javascript
   const result = await db.table('users')
     .where('id', userId)
     .select('*')
     .debug(true); // This will log the SQL query
   ```

3. Use MariaDB client to query database directly:
   ```bash
   docker exec -it mariadb-container mysql -u username -p database_name
   ```

## Common Issues and Solutions
1. **Component not rendering**
   - Check if the component is being rendered (React DevTools)
   - Verify that conditional rendering logic is correct
   - Check for errors in the console

2. **State not updating**
   - Verify that state update functions are being called
   - Check that you're not directly modifying state
   - Ensure useEffect dependencies are correct

3. **API calls failing**
   - Check network tab for errors
   - Verify API URL is correct
   - Check authentication tokens
   - Verify CORS settings

4. **Database queries not returning expected results**
   - Log the actual SQL query being executed
   - Run the query directly in database client
   - Check for transaction isolation issues
   - Verify that data was committed properly