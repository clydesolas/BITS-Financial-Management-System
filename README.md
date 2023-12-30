# Financial Management System for BITS Organization at Cavite State University Imus - Campus


## Technical Specifications

- **Backend:**
  - Java 17, Spring Boot v3.2

- **Frontend:**
  - Vite React v4.2.1

- **Database:**
  - MySQL 8.1

## System Features

### Common Features (For all roles):

- **Log in Module:**
  - User authentication for all roles.

- **Dashboard Module:**
  - Total count of active officers.
  - Financial Status/Summary.
  - User login history.

- **Account Settings Module:**
  - View personal account details.
  - Change password.
  - Deactivate account.

### Admin-Specific Features:

- **Officer Module (Admin):**
  - Officer page with a form for adding officers.
  - Table displaying the list of officers.
  - Automated email notification when adding an officer account.

### Treasurer-Specific Features:

- **Transaction Module (Treasurer):**
  - Transaction page with a form for cash inflow and outflow.
  - Table displaying the transaction list and can update transactions.
  - Updating a transaction has a versioning feature to record the update history.

### Auditor-Specific Features:

- **Report Module (Treasurer and Auditor):**
  - Report page with a table for all financial history.
  - Start and end date input for date range viewing.
  - Option to generate group reports as Excel.
  - Option to generate individual reports as PDF.

### Other Officers-Specific Features:

- No specific features other than viewing the dashboard page to check the financial status.
