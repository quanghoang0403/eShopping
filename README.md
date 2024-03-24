## 1. Backend

### 1.1 Architechture
- Framework: .NET 5.0  
- Patterns:  
    + Mediator design pattern (CQRS)
    + Domain-driven design  
    + Unit of work pattern  
- Database: SQL Server - Bearer Authentication 

### 1.2 EF
- add-migration [Message]
- update-database

## 2. Frontend

### 2.1 Admin Web Frontend
- Framework: ReactJS
- UI: Ant-Design, Bootstrap, SCSS
- Locales: i18
- Install package: npm i -f
- Run local: npm start
- Account: admin@gmail.com/1
- [https://eshopping-store-web.vercel.app/](https://eshopping-admin-web.vercel.app/)

### 2.2 Store Web Frontend
- Framework: NextJS 
- UI: Tailwind, Material-Tailwind, SCSS
- Locales: i18
- Install package: npm i -f
- Run local: npm run dev
- Account: customer@gmail.com/1
- [https://eshopping-store-web.vercel.app/](https://eshopping-store-web.vercel.app/)

## 3. Extension & Tool
### 3.1 Visual Studio
- Code clean up (Format Document, Remove unnecessary Imports or usings, Sort Imports or usings, Apply file header preferences, Apply new() preferences)
- Spell Check: https://marketplace.visualstudio.com/items?itemName=EWoodruff.VisualStudioSpellCheckerVS2022andLater

### 3.2 Visual Code
- Spell Check: https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker
- Prettier & Eslint format code
- User setting visual code
```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "eslint.validate": ["javascript", "typescript"],
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.codeActionsOnSave.rules": null,
  "[typescriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "workbench.iconTheme": "material-icon-theme",
  "window.zoomLevel": 0,
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[json]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "explorer.confirmDelete": false,
  "javascript.updateImportsOnFileMove.enabled": "never",
  "git.enableSmartCommit": true,
  "files.autoSave": "afterDelay",
  "gitlens.views.branches.branches.layout": "list",
  "workbench.editor.enablePreview": false,
  "liveServer.settings.CustomBrowser": "chrome",
  "tabnine.experimentalAutoImports": true,
  "scss.lint.unknownAtRules": "ignore",
  "css.lint.unknownAtRules": "ignore"
}
```
- Others extension
```
code --install-extension dbaeumer.vscode-eslint​
code --install-extension dsznajder.es7-react-js-snippets​
code --install-extension eamodio.gitlens​
code --install-extension esbenp.prettier-vscode​
code --install-extension formulahendry.auto-rename-tag​
code --install-extension mgmcdermott.vscode-language-babel​
code --install-extension PKief.material-icon-theme​
code --install-extension steoates.autoimport​
code --install-extension streetsidesoftware.code-spell-checker​
code --install-extension tal7aouy.theme​
code --install-extension xabikos.ReactSnippets
```

### 3.3 Browser
- Redux
- React-dev-tools

## 4. Work flow

### 4.1 Git 
- Create a branch base on latest main
- Dev feature
- Commit & push
- Create merge request & waiting to approve + merge
- After merged => merge main branch into current branch/ Create new branch base on latest main 
- Continue...

### 4.2 Task
- Map Backend API to UI and complete the feature
- Check & fix api if has error

### 4.3 To do
#### 18/3 -> 24/3
- [ ] Explain business (store + admin)
- [ ] Explain architechture (FE + BE)
- [ ] Run full flow
- [ ] Dump data + update DB
- [ ] Using swagger
- [ ] Using debug browser
- [ ] Test git work flow
- [ ] Note naming Admin and demo one feature
#### 25/3 -> 31/3
- [ ] ProductCategory

#### 1/4 -> 7/4
- [ ] Product