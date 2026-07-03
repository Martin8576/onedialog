import type { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#40929F',
    colorLink: "#40929F",
    borderRadiusXS: 4,
    borderRadius: 6,
    borderRadiusLG: 8,
    fontFamily: "'Nunito Sans', system-ui, sans-serif",
    fontSizeSM: 13,
    fontSize: 15,
    fontSizeLG: 17,
    fontWeightStrong: 900,
    boxShadow: "1px 1px 6px 0 rgba(0, 0, 0, 0.14)",
    boxShadowSecondary: "3px 3px 12px 0 rgba(0, 0, 0, 0.12)",
    boxShadowTertiary: "6px 6px 20px 0 rgba(0, 0, 0, 0.1)",
    controlHeightSM: 24,
  },
  components: {
    Button: {
      defaultShadow: 'none',
      primaryShadow: 'none',
      dangerShadow: 'none',
      paddingInline: 10,
    },
    Tag: {
      lineHeightSM: 22 / 12, // 20px line-height + 2 × 1px border = 22px tag height
    },
    Table: {
      headerBg: '#efefef',
      footerBg: '#efefef',
    },
  },
}

export default theme
