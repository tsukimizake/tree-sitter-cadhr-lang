; Indentation rules for cadhr-lang

; Indent after rule head
(rule
  ":-" @indent)

; Indent inside lists
(list
  "[" @indent
  "]" @dedent)

; Indent inside struct arguments
(struct
  "(" @indent
  ")" @dedent)
