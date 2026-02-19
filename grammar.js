/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "cadhr_lang",

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  conflicts: ($) => [
    // range_var can conflict with variable followed by comparison
    [$.range_var, $.variable],
    [$.default_var, $.variable],
  ],

  rules: {
    source_file: ($) => repeat($.clause),

    clause: ($) =>
      choice(
        $.rule,
        $.fact
      ),

    fact: ($) => seq($.term, "."),

    rule: ($) => seq($.term, ":-", $.goals, "."),

    goals: ($) => seq($.term, repeat(seq(",", $.term))),

    term: ($) => $.pipe_expr,

    pipe_expr: ($) =>
      prec.left(
        1,
        seq($.add_expr, repeat(seq("|>", $.add_expr)))
      ),

    add_expr: ($) =>
      prec.left(
        2,
        seq($.mul_expr, repeat(seq(choice("+", "-"), $.mul_expr)))
      ),

    mul_expr: ($) =>
      prec.left(
        3,
        seq($.primary_term, repeat(seq(choice("*", "/"), $.primary_term)))
      ),

    primary_term: ($) =>
      choice(
        $.list,
        $.paren_expr,
        $.default_var,
        $.range_var,
        $.number,
        $.struct,
        $.atom,
        $.variable
      ),

    default_var: ($) => seq($.variable, "@", $.number),

    paren_expr: ($) => seq("(", $.term, ")"),

    // Range variable: 0 < X < 10, X <= 10, 0 <= X, etc.
    range_var: ($) =>
      prec(
        10,
        choice(
          // Both bounds: 0 < X < 10
          seq($.number, $.comp_op, $.variable, $.comp_op, $.number),
          // Left bound only: 0 < X
          seq($.number, $.comp_op, $.variable),
          // Right bound only: X < 10
          seq($.variable, $.comp_op, $.number)
        )
      ),

    comp_op: ($) => choice("<=", ">=", "<", ">"),

    // List: [a, b, c] or [H|T]
    list: ($) =>
      seq(
        "[",
        optional(
          seq(
            $.term,
            repeat(seq(",", $.term)),
            optional(seq("|", $.term))
          )
        ),
        "]"
      ),

    // Struct/functor: atom(arg1, arg2, ...)
    struct: ($) =>
      seq(
        $.atom,
        "(",
        optional(seq($.term, repeat(seq(",", $.term)))),
        ")"
      ),

    // Atom: lowercase identifier or quoted atom
    atom: ($) => choice($.unquoted_atom, $.quoted_atom),

    unquoted_atom: ($) => /[a-z][a-zA-Z0-9_]*/,

    quoted_atom: ($) =>
      seq(
        "'",
        repeat(
          choice(
            $.escape_sequence,
            /[^'\\]+/
          )
        ),
        "'"
      ),

    escape_sequence: ($) => /\\['\\\nt]/,

    // Variable: uppercase or underscore start
    variable: ($) => /[A-Z_][a-zA-Z0-9_]*/,

    // Number: integer with optional negative sign
    number: ($) => /-?[0-9]+/,

    // Comments
    line_comment: ($) => seq("%", /[^\n]*/),

    block_comment: ($) => seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
  },
});
