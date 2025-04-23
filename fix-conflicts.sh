#!/bin/bash

# Fix SpottingExitScams.tsx
sed -i '' '/^<<<<<<< HEAD$/d' src/pages/SpottingExitScams.tsx
sed -i '' '/^=======$/d' src/pages/SpottingExitScams.tsx
sed -i '' '/^>>>>>>> /d' src/pages/SpottingExitScams.tsx

# Fix TimeshareScamChecklist.tsx
sed -i '' '/^<<<<<<< HEAD$/d' src/pages/TimeshareScamChecklist.tsx
sed -i '' '/^=======$/d' src/pages/TimeshareScamChecklist.tsx
sed -i '' '/^>>>>>>> /d' src/pages/TimeshareScamChecklist.tsx

# Fix WhereScamsThrive.tsx
sed -i '' '/^<<<<<<< HEAD$/d' src/pages/WhereScamsThrive.tsx
sed -i '' '/^=======$/d' src/pages/WhereScamsThrive.tsx
sed -i '' '/^>>>>>>> /d' src/pages/WhereScamsThrive.tsx

# Fix emailService.ts
sed -i '' '/^<<<<<<< HEAD$/d' src/services/emailService.ts
sed -i '' '/^=======$/d' src/services/emailService.ts
sed -i '' '/^>>>>>>> /d' src/services/emailService.ts 