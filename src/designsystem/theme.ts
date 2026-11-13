import type { ThemeConfig } from 'antd'

declare module 'antd/es/theme/interface/alias' {
  interface AliasToken {
    colorGrey: string
    colorGrey6: string
    colorGrey10: string
    colorGrey16: string
    colorGrey20: string
    colorGrey30: string
    colorGrey40: string
    colorGrey50: string
    colorGrey60: string
    colorGrey70: string
    colorGrey80: string
    colorGrey90: string
  }
}

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#40929F',
    colorPrimaryBg: '#D9E9EC',
    colorGrey: '#444444',
    colorGrey6: '#F4F4F4',
    colorGrey10: '#ECECEC',
    colorGrey16: '#E1E1E1',
    colorGrey20: '#DADADA',
    colorGrey30: '#C7C7C7',
    colorGrey40: '#B4B4B4',
    colorGrey50: '#A2A2A2',
    colorGrey60: '#8F8F8F',
    colorGrey70: '#7C7C7C',
    colorGrey80: '#696969',
    colorGrey90: '#575757',
    colorSuccess: '#13B741',
    colorInfo: '#40929F',
    colorWarning: '#FECB00',
    colorError: '#BE2356',
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
    Tabs: {
      horizontalItemGutter: 20,
    },
    Tag: {
      lineHeightSM: 22 / 12, // 20px line-height + 2 × 1px border = 22px tag height
    },
    Table: {
      headerBg: '#efefef',
      footerBg: '#efefef',
    },
    Form: {
      itemMarginBottom: 10,
      verticalLabelPadding: '0 0 4px',
    }
  },
}

export default theme
