/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "cadhr_lang",

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  conflicts: ($) => [],

  rules: {
    source_file: ($) => repeat(choice($.clause, $.use_directive)),

    clause: ($) =>
      choice(
        $.rule,
        $.fact
      ),

    use_directive: ($) =>
      seq(
        "#use",
        "(",
        $.string_literal,
        optional(seq(",", $.use_expose)),
        ")",
        "."
      ),

    use_expose: ($) =>
      seq("expose", "(", "[", optional(seq($.atom, repeat(seq(",", $.atom)))), "]", ")"),

    fact: ($) => seq($.term, "."),

    rule: ($) => seq($.term, ":-", $.goals, "."),

    goals: ($) => seq($.goal, repeat(seq(",", $.goal))),

    goal: ($) => choice($.eq_constraint, $.term),

    eq_constraint: ($) => seq($.term, "=", $.term),

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
        $.annotated_var,
        $.number,
        $.string_literal,
        $.struct,
        $.qualified_atom,
        $.atom,
        $.variable
      ),

    annotated_var: ($) =>
      prec(
        10,
        choice(
          seq($.number, $.comp_op, $.variable, "@", $.number, $.comp_op, $.number),
          seq($.number, $.comp_op, $.variable, "@", $.number),
          seq($.number, $.comp_op, $.variable, $.comp_op, $.number),
          seq($.number, $.comp_op, $.variable),
          seq($.variable, "@", $.number, $.comp_op, $.number),
          seq($.variable, "@", $.number),
          seq($.variable, $.comp_op, $.number)
        )
      ),

    paren_expr: ($) => seq("(", $.term, ")"),

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

    qualified_atom: ($) => seq($.atom, "::", $.atom),

    // Struct/functor: atom(arg1, arg2, ...) or module::atom(arg1, ...)
    struct: ($) =>
      seq(
        choice($.qualified_atom, $.atom),
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

    escape_sequence: ($) => /\\['"\\nt]/,

    string_literal: ($) =>
      seq(
        '"',
        repeat(
          choice(
            $.escape_sequence,
            /[^"\\]+/
          )
        ),
        '"'
      ),

    // Variable: uppercase or underscore start
    variable: ($) => /[A-Z_][a-zA-Z0-9_]*/,

    // Number: integer or fixed-point decimal (up to 2 decimal places)
    number: ($) => /-?[0-9]+(\.[0-9]{1,2})?/,

    // Comments
    line_comment: ($) => seq("%", /[^\n]*/),

    block_comment: ($) => seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
  },
});
