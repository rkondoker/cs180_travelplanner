# CS180_TravelPlanner

## Commands

### Pulling From Repository

When you pull the repoistory to your local machine, be sure to run the following command to install all dependencies:

```
npm i
```

### Importing the Database To Your Local Machine

1. First of all, make sure you have PostgreSQL installed. Here is the [link](https://www.postgresql.org/) to download it.
2. Download [pgAdmin4](https://www.pgadmin.org/download/pgadmin-4-windows/)
3. When you open pgAdmin4 for the first time, it will prompt you for the password. **Remember your password since you will need it to communicate with the database locally.**
4. Open pgAdmin4
5. You will be in a menu screen. You will see a menu that contains a `Servers` dropdown. Go to Servers -> PostgreSQL -> Databases.
6. Right click on Database, go to Create -> Database...
7. Enter the name of the database (preferably `cs180-travel-planner`). Then press save. The database should be created.
8. Go into your newly created database and go to Schemas -> public -> Tables. The `Tables` section should be empty.
9. Right click on the `Tables` section, then click on `Query Tool`. You will now be taken into a text editor to run SQL code.
10. When you cloned the repository on your IDE, go to the `db` folder and copy the script located in the `cs180-travel-planner-db.sql` file. Paste this script into the text editor.
11. Slightly above the text editor, you will see an arrow. When you hover over it, it will say `Execute script`. Click on this button. You should get a message saying that the query returned successfully.
12. On the left navigation bar, go to Default Workspace. Then go back to where you have your database.
13. In your database, go to Schemas. Click on refresh.
14. Now go to Schemas -> Tables and click the dropdown menu once. You will see that the tables have been loaded in successfully.
15. To view the data in a table, go to the table of your choice. Right click on it, then go to View/Edit Data -> All Rows. This will show all the rows for this table.
16. Now, we will be using the password you created when you first signed up in pgAdmin4. In your IDE, in the project folder, go to server -> db.js. Go ahead and paste in the password into the password area in this file. This ensures proper communication with the backend server so that you can have access to your local database.

**IMPORTANT NOTE**
**When you push your changes to the repository, do not push your password along with your commit. Be sure to remove it before you commit any changes.**

### Running the Website

When you want to run the website, use the following command:

```
npm run dev
```
