/* eslint-disable no-restricted-imports */
import * as React from 'react';
import { space, SpaceProps, LayoutProps } from 'styled-system';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import { theme } from '@components/global/theme';
import { safeKey } from '@common/utils';
import { Tooltip } from '@material-ui/core';
import {
  Menu,
  Close,
  Search,
  NotificationsNone,
  AccountCircle,
  PhotoCamera,
  ExpandMore,
  ExpandLess,
  Visibility,
  VisibilityOff,
  Check,
  CheckCircle,
  CloudUpload,
  Cancel,
  RadioButtonUnchecked,
  RadioButtonChecked,
  CheckBoxOutlineBlank,
  CheckBox,
  MoreVert,
  Star,
  FavoriteBorder,
  Favorite,
  FiberManualRecord,
  FiberManualRecordOutlined,
  Public,
  List,
  MonetizationOn,
  Person,
  StarBorder,
  CardMembership,
  Lock,
  Rocket,
  ExitToApp,
  Info,
  InfoOutlined,
  CheckCircleOutline,
  HighlightOff,
  Warning,
  ArrowBack,
  HelpOutline,
  ErrorOutline,
  Today,
  Image,
  OndemandVideo,
  Phone,
  Facebook,
  Line,
  ArrowDropDown,
  ArrowDropUp,
  Sync,
  Add,
  AddCircleOutline,
  ChevronLeft,
  ChevronRight,
  Event,
  LocationOn,
  LocationOnOutlined,
  PhoneAndroid,
  Share,
  MailOutline,
  PersonOutline,
  Edit,
  Vip,
  TableChartOutlined,
  Tune,
  ShoppingCart,
  Language,
  CircleTh,
  CircleEn,
  FormatListBulleted,
  ViewModule,
} from './icons';

// list out color types
type ThemeColors = keyof typeof theme.colors;

interface IconWrapperProps extends SpaceProps, LayoutProps {
  cursor?: string;
  color?: ThemeColors;
}

const IconWrapper = styled.div<IconWrapperProps>`
  ${space}
  display: inline-block;
  font-size: ${({ size }) => size};
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  cursor: ${({ cursor }) => cursor ?? 'pointer'};
  color: ${({ theme, color }) => {
    if (color in theme.colors) {
      return theme.colors[safeKey(color)];
    }

    return theme.colors.icon;
  }};
  svg {
    display: block;
  }
`;

export interface IconButtonProps extends SpaceProps, LayoutProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  color?: ThemeColors;
  tooltip?: any;
}

function withIconStyle(Icon: typeof SvgIcon): React.ComponentType<IconButtonProps> {
  const IconWithStyle: React.FC<IconButtonProps> = (props: IconButtonProps) => {
    const { size, tooltip, onClick, ...rest } = props;
    const cursor = onClick ? 'pointer' : '';

    return tooltip ? (
      <Tooltip title={tooltip}>
        <IconWrapper size={size} cursor={cursor} {...rest}>
          <Icon fontSize="inherit" color="inherit" onClick={onClick} />
        </IconWrapper>
      </Tooltip>
    ) : (
      <IconWrapper size={size} cursor={cursor} {...rest}>
        <Icon fontSize="inherit" color="inherit" onClick={onClick} />
      </IconWrapper>
    );
  };

  IconWithStyle.defaultProps = {
    size: '24px',
    tooltip: null,
  };

  return IconWithStyle;
}

export const MenuIcon = withIconStyle(Menu);

export const CloseIcon = withIconStyle(Close);

export const SearchIcon = withIconStyle(Search);

export const NotificationsNoneIcon = withIconStyle(NotificationsNone);

export const AccountCircleIcon = withIconStyle(AccountCircle);

export const PhotoCameraIcon = withIconStyle(PhotoCamera);

export const ExpandMoreIcon = withIconStyle(ExpandMore);

export const ExpandLessIcon = withIconStyle(ExpandLess);

export const CheckCircleIcon = withIconStyle(CheckCircle);

export const CheckIcon = withIconStyle(Check);

export const VisibilityIcon = withIconStyle(Visibility);

export const VisibilityOffIcon = withIconStyle(VisibilityOff);

export const CloudUploadIcon = withIconStyle(CloudUpload);

export const CancelIcon = withIconStyle(Cancel);

export const RadioButtonUncheckedIcon = withIconStyle(RadioButtonUnchecked);

export const RadioButtonCheckedIcon = withIconStyle(RadioButtonChecked);

export const CheckBoxOutlineBlankIcon = withIconStyle(CheckBoxOutlineBlank);

export const CheckBoxIcon = withIconStyle(CheckBox);

export const MoreVertIcon = withIconStyle(MoreVert);

export const StarBorderIcon = withIconStyle(StarBorder);

export const StarIcon = withIconStyle(Star);

export const FavoriteBorderIcon = withIconStyle(FavoriteBorder);

export const FavoriteIcon = withIconStyle(Favorite);

export const FiberManualRecordIcon = withIconStyle(FiberManualRecord);

export const FiberManualRecordOutlinedIcon = withIconStyle(FiberManualRecordOutlined);

export const PublicIcon = withIconStyle(Public);

export const ListIcon = withIconStyle(List);

export const MonetizationOnIcon = withIconStyle(MonetizationOn);

export const PersonIcon = withIconStyle(Person);

export const CardMembershipIcon = withIconStyle(CardMembership);

export const LockIcon = withIconStyle(Lock);

export const RocketIcon = withIconStyle(Rocket);

export const ExitToAppIcon = withIconStyle(ExitToApp);

export const InfoIcon = withIconStyle(Info);

export const InfoOutlinedIcon = withIconStyle(InfoOutlined);

export const CheckCircleOutlineIcon = withIconStyle(CheckCircleOutline);

export const HighlightOffIcon = withIconStyle(HighlightOff);

export const WarningIcon = withIconStyle(Warning);

export const ArrowBackIcon = withIconStyle(ArrowBack);

export const HelpOutlineIcon = withIconStyle(HelpOutline);

export const ErrorOutlineIcon = withIconStyle(ErrorOutline);

export const TodayIcon = withIconStyle(Today);

export const ImageIcon = withIconStyle(Image);

export const OndemandVideoIcon = withIconStyle(OndemandVideo);

export const PhoneIcon = withIconStyle(Phone);

export const FacebookIcon = withIconStyle(Facebook);

export const LineIcon = withIconStyle(Line);

export const ArrowDropDownIcon = withIconStyle(ArrowDropDown);

export const ArrowDropUpIcon = withIconStyle(ArrowDropUp);

export const SyncIcon = withIconStyle(Sync);

export const AddIcon = withIconStyle(Add);

export const AddCircleOutlineIcon = withIconStyle(AddCircleOutline);

export const ChevronLeftIcon = withIconStyle(ChevronLeft);

export const ChevronRightIcon = withIconStyle(ChevronRight);

export const EventIcon = withIconStyle(Event);

export const LocationOnIcon = withIconStyle(LocationOn);

export const LocationOnOutlinedIcon = withIconStyle(LocationOnOutlined);

export const PhoneAndroidIcon = withIconStyle(PhoneAndroid);

export const ShareIcon = withIconStyle(Share);

export const MailOutlineIcon = withIconStyle(MailOutline);

export const PersonOutlineIcon = withIconStyle(PersonOutline);

export const EditIcon = withIconStyle(Edit);

export const TableChartOutlinedIcon = withIconStyle(TableChartOutlined);

export const ShoppingCartIcon = withIconStyle(ShoppingCart);

export const LanguageIcon = withIconStyle(Language);

export const CircleThIcon = withIconStyle(CircleTh);

export const CircleEnIcon = withIconStyle(CircleEn);

export const GreenCheckIcon = withStyles({
  root: {
    backgroundColor: 'white',
    width: '16px',
    height: '16px',
    color: '#5AB203',
    borderRadius: '100%',
  },
})(CheckCircle);

export const VipIcon = withIconStyle(Vip);

export const TuneIcon = withIconStyle(Tune);

export const FormatListBulletedIcon = withIconStyle(FormatListBulleted);

export const ViewModuleIcon = withIconStyle(ViewModule);
