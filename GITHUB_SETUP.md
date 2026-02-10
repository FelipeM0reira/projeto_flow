# Instruções para Push no GitHub 🚀

## 1️⃣ Criar Repositório no GitHub

Acesse https://github.com/new e crie um novo repositório:

- **Nome**: ProjetoFlow
- **Descrição**: Aplicação web para gestão de tarefas com tema claro e escuro
- **Visibilidade**: Public ou Private (sua escolha)
- **NÃO** inicialize com README, .gitignore ou LICENSE (já temos)

## 2️⃣ Conectar Repositório Local ao GitHub

```bash
# Navegue até a pasta do projeto
cd /home/joaog/projetos/projetos/projetoflow

# Adicione o remote do GitHub
git remote add origin https://github.com/seu-usuario/ProjetoFlow.git

# Renomeie branch master para main (recomendado)
git branch -m master main

# Faça o push inicial
git push -u origin main
```

## 3️⃣ Configuração Inicial do Repositório

```bash
# Configure seu email e nome Git (se não fez)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"

# Crie branch develop para desenvolvimento
git checkout -b develop
git push -u origin develop
```

## 4️⃣ Configurar Proteção de Branch (Opcional)

No GitHub, acesse Settings → Branches:

- Clique em "Add rule"
- Padrão de branch: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

## 5️⃣ Ativar GitHub Actions (CI/CD)

O arquivo `.github/workflows/ci-cd.yml` já está preparado:

1. Vá a Actions no seu repositório
2. A primeira execução deve começar automaticamente
3. Verifique se passa em todos os testes

## 6️⃣ Primeiros Commits

```bash
# Feature branches devem sair de develop
git checkout develop

# Crie sua primeira feature
git checkout -b feature/setup-frontend
# ... faça mudanças ...
git add .
git commit -m "feat(frontend): setup initial React structure"
git push -u origin feature/setup-frontend

# Abra Pull Request no GitHub
# - Compare: feature/setup-frontend → develop
# - Adicione descrição
# - Peça para revisar
# - Após aprovação, merge
```

## 📊 Estrutura de Branches

```
main (production)
  ↑
  ├← develop (staging/integration)
  │   ↑
  │   ├← feature/* (novas features)
  │   ├← bugfix/* (correções de bugs)
  │   └← refactor/* (refatorações)
```

## 🔐 Secrets para GitHub Actions

Se quiser usar ações automáticas, adicione secrets em Settings → Secrets:

```
DOCKER_USERNAME = seu-usuario
DOCKER_PASSWORD = seu-token
```

## 📝 IMPORTANT: Adicione ao README

Após fazer push, atualize o README.md com:

```markdown
## 📦 Repositório

- **GitHub**: https://github.com/seu-usuario/ProjetoFlow
- **Issues**: https://github.com/seu-usuario/ProjetoFlow/issues
- **Discussions**: https://github.com/seu-usuario/ProjetoFlow/discussions
```

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Remote adicionado localmente
- [ ] Branch main fez push com sucesso
- [ ] Branch develop criada
- [ ] .gitignore funcionando (node_modules, **pycache** não aparecem)
- [ ] GitHub Actions passando (check mark verde)
- [ ] Branch protection rules ativadas
- [ ] README.md com link do repositório

## 📚 Recursos Úteis

- [GitHub Help](https://docs.github.com/en)
- [Git Cheatsheet](https://github.github.com/training-kit/)
- [GitHub Issues](https://guides.github.com/features/issues/)
- [GitHub Project Boards](https://docs.github.com/en/issues/planning-and-tracking-with-projects)

## 🚀 Próximas Ações

1. Convide colaboradores (Settings → Collaborators)
2. Configure project board (Projects → New)
3. Crie milestones para sprints
4. Abra as primeiras issues

---

**Pronto!** Seu repositório ProjetoFlow está no GitHub! 🎉
