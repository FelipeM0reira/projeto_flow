# Guia de Contribuição

Obrigado por considerar contribuir com o Theme Switcher Application! Este documento fornece diretrizes para contribuir com o projeto.

## Código de Conduta

Este projeto e todos os participantes são regidos por nosso Código de Conduta. Ao participar, espera-se que você mantenha este código. Por favor, relate comportamentos inaceitáveis.

## Como Contribuir

### Reportando Bugs

Antes de criar um relatório de bug, verifique se já não existe uma issue semelhante. Ao criar um bug report, inclua:

- **Título claro e descritivo**
- **Passos para reproduzir** o problema
- **Comportamento esperado** e **comportamento observado**
- **Screenshots** se aplicável
- **Ambiente**: SO, versão do Docker, navegador, etc.

### Sugerindo Melhorias

Para sugerir melhorias:

1. Verifique se já não existe uma sugestão similar
2. Crie uma issue descrevendo:
   - A melhoria proposta
   - Por que ela seria útil
   - Como deveria funcionar

### Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```
4. **Faça suas alterações** seguindo os padrões do projeto
5. **Execute os testes**:
   ```bash
   # Backend
   docker-compose exec backend pytest
   
   # Frontend
   docker-compose exec frontend npm test -- --watchAll=false
   ```
6. **Commit** suas mudanças:
   ```bash
   git commit -m 'Add: descrição da feature'
   ```
7. **Push** para sua branch:
   ```bash
   git push origin feature/MinhaNovaFeature
   ```
8. **Abra um Pull Request**

## Padrões de Desenvolvimento

### Commits

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula faltando, etc.
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Manutenção, atualização de dependências

Exemplos:
```
feat: adicionar autenticação JWT
fix: corrigir erro ao deletar usuário
docs: atualizar README com instruções de deploy
test: adicionar testes para UserController
```

### Código Python (Backend)

- Siga o [PEP 8](https://pep8.org/)
- Use type hints quando possível
- Docstrings para funções e classes
- Máximo de 100 caracteres por linha

```python
def create_user(username: str, email: str, theme: str = 'light') -> User:
    """
    Create a new user with given parameters.
    
    Args:
        username: Unique username for the user
        email: User's email address
        theme: Theme preference ('light' or 'dark')
        
    Returns:
        User: The created user instance
    """
    user = User(username=username, email=email, theme_preference=theme)
    user.save()
    return user
```

### Código JavaScript (Frontend)

- Use ESLint com configuração React
- Componentes funcionais com Hooks
- PropTypes ou TypeScript para validação
- Nomes descritivos para variáveis e funções

```javascript
/**
 * Component for switching between light and dark themes
 * @param {Object} props - Component props
 * @param {string} props.currentTheme - Current theme ('light' or 'dark')
 * @param {Function} props.onThemeChange - Callback when theme changes
 */
const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  // Implementation
};
```

### Testes

#### Backend (pytest)

- Siga TDD: escreva testes antes da implementação
- Um arquivo de teste por módulo: `test_[module].py`
- Classe de teste por classe testada: `TestUserModel`
- Método de teste descritivo: `test_create_user_with_valid_data`

```python
@pytest.mark.django_db
class TestUserModel:
    def test_create_user_with_valid_data(self):
        """Test creating a user with valid data succeeds."""
        user = User.objects.create(
            username='testuser',
            email='test@example.com'
        )
        assert user.id is not None
        assert user.username == 'testuser'
```

#### Frontend (Jest)

- Testes para cada componente
- Teste comportamento, não implementação
- Use Testing Library para queries semânticas

```javascript
describe('ThemeSwitcher', () => {
  test('toggles theme when button is clicked', async () => {
    const onThemeChange = jest.fn();
    render(<ThemeSwitcher currentTheme="light" onThemeChange={onThemeChange} />);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });
});
```

### CSS

- Use nomes de classe descritivos
- Organize por componente
- Use variáveis CSS para cores e temas
- Mobile-first quando possível

```css
.user-list {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Spacing */
  padding: 1rem;
  gap: 0.5rem;
  
  /* Visual */
  background-color: var(--bg-color);
  border-radius: 8px;
}
```

## Estrutura de Branches

- `main` - Código de produção estável
- `develop` - Branch de desenvolvimento
- `feature/*` - Novas funcionalidades
- `bugfix/*` - Correções de bugs
- `hotfix/*` - Correções urgentes

## Processo de Review

Pull Requests serão revisados considerando:

1. **Funcionalidade**: O código faz o que deveria?
2. **Testes**: Há testes adequados?
3. **Documentação**: Está bem documentado?
4. **Estilo**: Segue os padrões do projeto?
5. **Performance**: Há impacto na performance?

## Dúvidas?

Se você tiver dúvidas sobre como contribuir:

1. Verifique a documentação existente
2. Procure em issues fechadas
3. Abra uma issue com sua pergunta
4. Entre em contato com os mantenedores

## Reconhecimento

Todos os contribuidores serão reconhecidos no projeto. Obrigado por ajudar a melhorar o Theme Switcher Application!
