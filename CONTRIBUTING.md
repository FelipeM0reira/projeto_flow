# Guia de Contribuição

Obrigado por considerar contribuir para o ProjetoFlow! 🎉

## Como Contribuir

### 1. Configurando o Ambiente de Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ProjetoFlow.git
cd ProjetoFlow

# Crie uma branch para sua feature
git checkout -b feature/sua-feature-name
```

### 2. Desenvolvendo

#### Backend (Django)

```bash
cd backend

# Crie ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instale dependências
pip install -r requirements.txt

# Configure arquivo .env
cp .env.example .env

# Execute migrações
python manage.py migrate

# Inicie servidor
python manage.py runserver

# Execute testes
pytest

# Format código com Black
black src tests

# Lint com flake8
flake8 src tests

# Type checking com mypy
mypy src
```

#### Frontend (React)

```bash
cd frontend

# Instale dependências
npm install

# Inicie servidor de desenvolvimento
npm run dev

# Execute testes
npm run test

# Verifique linting
npm run lint

# Build para produção
npm run build
```

### 3. Commit dos Mudanças

Use mensagens de commit claras e descritivas:

```bash
# Exemplos:
git commit -m "feat: adicionar tema escuro"
git commit -m "fix: corrigir bug de autenticação"
git commit -m "docs: atualizar README"
git commit -m "test: adicionar testes para Projects"
```

#### Formato de Mensagem

```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

**Tipos válidos:**

- `feat:` - Nova feature
- `fix:` - Corrige um bug
- `docs:` - Documentação
- `style:` - Formatação, sem mudança de lógica
- `refactor:` - Refatoração de código
- `perf:` - Melhorias de performance
- `test:` - Adiciona ou modifica testes
- `chore:` - Tarefas auxiliares, dependências

**Exemplos:**

```
feat(auth): implementar autenticação JWT

Implementa sistema de autenticação usando JWT tokens com melhor segurança.

Closes #123
```

### 4. Código de Conduta

- Sempre seja respeitoso
- Evite linguagem discriminatória
- Dê crédito ao trabalho dos outros
- Foque em discussões técnicas, não pessoais

### 5. Testes

**Obrigatório:** Toda feature deve incluir testes

```bash
# Backend
cd backend
pytest tests/test_new_feature.py

# Frontend
cd frontend
npm run test -- path/to/test
```

Mantenha cobertura de testes acima de 80%:

```bash
# Backend com cobertura
pytest --cov=src --cov-report=html

# Frontend
npm run coverage
```

### 6. Padrões de Código

#### Backend (Python)

- Siga PEP 8
- Use type hints
- Docstrings em doctest format
- Máx 88 caracteres por linha (Black)

```python
def criar_projeto(usuario: User, nome: str) -> Project:
    """Cria um novo projeto para o usuário.

    Args:
        usuario: O usuário proprietário do projeto
        nome: Nome do projeto

    Returns:
        Instância do projeto criado

    Raises:
        ValueError: Se nome está vazio
    """
    if not nome:
        raise ValueError("Nome não pode ser vazio")

    return Project.objects.create(user=usuario, name=nome)
```

#### Frontend (TypeScript/React)

- Use functional components com hooks
- Props com types explícitos
- Arquivo único para componente + tipos
- Máx 100 caracteres por linha

```typescript
interface ProjectProps {
  id: string;
  name: string;
  onDelete: (id: string) => void;
}

export function ProjectCard({ id, name, onDelete }: ProjectProps) {
  return (
    <div>
      <h3>{name}</h3>
      <button onClick={() => onDelete(id)}>Deletar</button>
    </div>
  );
}
```

### 7. Pull Request

1. **Antes de fazer PR:**
   - Rebase na branch `main` mais recente
   - Execute testes localmente
   - Verifique linting
   - Atualize documentação se necessário

2. **Template do PR:**

```markdown
## Descrição

Descrição breve do que foi feito.

## Tipo de Mudança

- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como testar?

Passos para testar this PR.

## Checklist

- [ ] Testes adicionados/passando
- [ ] Documentação atualizada
- [ ] Sem breaking changes
- [ ] Código segue padrões do projeto
```

### 8. Revisão de Código

Ao revisar:

- Seja construtivo e educado
- Pergunte em vez de ordenar
- Sugira melhorias
- Elogie código bom

### 9. Problemas Conhecidos

Se encontrar um bug:

1. Verifique se já foi reportado
2. Inclua: versão, SO, passos para reproduzir
3. Adicione logs/screenshots se possível

### 10. Estrutura de Branches

```
main              - Código em produção
├── develop       - Desenvolvimento (base para PRs)
├── feature/*     - Novas features
├── bugfix/*      - Correções de bugs
├── docs/*        - Documentação
└── refactor/*    - Refatorações
```

## Documentação

- README.md - Overview do projeto
- docs/ - Documentação detalhada
- ARCHITECTURE.md - Arquitetura do sistema
- API.md - Documentação da API

## Recompensas

Contribuidores ativos podem receber:

- Menção no contributors
- Badge no README
- Permissões de manutenção

## Dúvidas?

- Abra uma issue
- Verifique discussões existentes
- Entre em contato: dev@projetoflow.com

---

Obrigado por contribuir! 🙏
