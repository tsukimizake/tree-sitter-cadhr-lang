; Comments
(line_comment) @comment
(block_comment) @comment

; Keywords/Operators
":-" @keyword
"|>" @operator
"+" @operator
"-" @operator
"*" @operator
"/" @operator
"<" @operator
">" @operator
"<=" @operator
">=" @operator
"|" @operator
"." @punctuation.delimiter
"," @punctuation.delimiter
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket

; Variables (uppercase or underscore start)
(variable) @variable

; Anonymous variable
((variable) @variable.builtin
 (#eq? @variable.builtin "_"))

; Use directive
"#use" @keyword
"expose" @keyword

; Numbers
(number) @number

; Atoms (functors/predicates) - use function.builtin for all
(struct
  (atom) @function)
(struct
  (qualified_atom) @function)

; Standalone atoms (not function calls)
(atom) @constant

; String literals
(string_literal) @string

; Quoted atoms
(quoted_atom) @string

; Escape sequences in quoted atoms and strings
(escape_sequence) @string.escape

; Range variable bounds
(range_var
  (variable) @variable)
(range_var
  (number) @number)
(range_var
  (comp_op) @operator)
