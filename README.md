# tree-sitter-cadhr-lang

Tree-sitter grammar for cadhr-lang (Prolog-like CAD language).

## Neovim Setup

### 1. Install the parser

Add to your Neovim configuration (using lazy.nvim example):

```lua
-- In your plugin config
{
  "nvim-treesitter/nvim-treesitter",
  build = ":TSUpdate",
  config = function()
    local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
    
    parser_config.cadhr_lang = {
      install_info = {
        url = "/path/to/daccad/tree-sitter-cadhr-lang",  -- local path
        files = {"src/parser.c"},
        branch = "main",
        generate_requires_npm = false,
        requires_generate_from_grammar = false,
      },
      filetype = "cadhr",
    }
    
    require("nvim-treesitter.configs").setup({
      ensure_installed = { "cadhr_lang" },
      highlight = { enable = true },
    })
  end,
}
```

### 2. Set up filetype detection

Create `~/.config/nvim/ftdetect/cadhr.lua`:

```lua
vim.filetype.add({
  extension = {
    cadhr = "cadhr",
  },
})
```

### 3. Copy query files

Copy the queries to Neovim's runtime path:

```bash
mkdir -p ~/.config/nvim/queries/cadhr_lang
cp queries/*.scm ~/.config/nvim/queries/cadhr_lang/
```

### 4. Install the parser

In Neovim:
```
:TSInstall cadhr_lang
```

Or manually:
```bash
cd tree-sitter-cadhr-lang
tree-sitter generate
```

## Language Features

- Facts: `parent(alice, bob).`
- Rules: `grandparent(X, Y) :- parent(X, Z), parent(Z, Y).`
- Lists: `[a, b, c]` or `[H|T]`
- Range variables: `0 < X < 10`
- Pipe operator: `cube(1,1,1) |> scale(2) |> translate(5,5,5).`
- Arithmetic: `+`, `-`, `*`, `/`
- Comments: `% line comment` and `/* block comment */`

## Highlight Groups

- `@comment` - Comments
- `@function` - Functors/predicates
- `@function.builtin` - Built-in CAD primitives (cube, sphere, etc.)
- `@variable` - Variables (uppercase)
- `@variable.builtin` - Anonymous variable (`_`)
- `@number` - Numbers
- `@string` - Quoted atoms
- `@operator` - Operators
- `@keyword` - `:-`
- `@constant` - Atoms

## Development

```bash
npm install
npm run build    # Generate parser
npm run test     # Run tests
```
