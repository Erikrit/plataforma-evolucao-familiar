import { createTheme, rem } from "@mantine/core";

/** Identidade Azul Contemporâneo — docs/ux-ui/GUIA-DE-EXPERIENCIA.md */
export const temaPef = createTheme({
  primaryColor: "azul",
  colors: {
    azul: [
      "#E8EFFC",
      "#D4E1F7",
      "#A9C3EF",
      "#7DA4E6",
      "#5688DC",
      "#3569C8",
      "#2B56A6",
      "#224484",
      "#193362",
      "#102140",
    ],
    apoio: [
      "#FBF3EB",
      "#F5E3D1",
      "#EBC7A3",
      "#E5A66A",
      "#D9924F",
      "#C77D3A",
      "#A4652E",
      "#814E24",
      "#5E391A",
      "#3B2410",
    ],
  },
  fontFamily:
    'Inter, "Segoe UI", "Helvetica Neue", system-ui, -apple-system, sans-serif',
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  headings: {
    fontFamily:
      'Inter, "Segoe UI", "Helvetica Neue", system-ui, -apple-system, sans-serif',
    sizes: {
      h1: { fontSize: rem(28), lineHeight: "1.25" },
      h2: { fontSize: rem(22), lineHeight: "1.3" },
      h3: { fontSize: rem(20), lineHeight: "1.35" },
    },
  },
  defaultRadius: "md",
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  components: {
    Button: {
      defaultProps: {
        size: "md",
      },
      styles: {
        root: {
          minHeight: rem(44),
        },
      },
    },
    TextInput: {
      defaultProps: {
        size: "md",
      },
    },
    Select: {
      defaultProps: {
        size: "md",
      },
    },
    Alert: {
      defaultProps: {
        radius: "md",
      },
    },
  },
});

export const coresPef = {
  primaria: "#3569C8",
  primariaSuave: "#E8EFFC",
  apoio: "#E5A66A",
  fundo: "#F6F8FC",
  texto: "#23344F",
  superficie: "#FFFFFF",
} as const;
