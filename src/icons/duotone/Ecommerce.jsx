import { SvgIcon } from '@mui/material';

const Ecommerce = props => {
  return <SvgIcon viewBox="0 0 14 13" sx={{
    '& .secondary': {
      opacity: 0.4
    }
  }} {...props}>
      <path d="M3.64337 6.46058C3.51212 6.75468 3.16699 6.88593 2.87289 6.75468C2.57879 6.62343 2.44754 6.27829 2.57879 5.98419L5.10657 0.344816C5.23782 0.0508892 5.58296 -0.0806038 5.87706 0.0511809C6.17115 0.182966 6.3024 0.52808 6.17115 0.822177L3.64337 6.46058ZM7.82879 0.822177C7.69754 0.52808 7.82879 0.182966 8.12289 0.0511809C8.41699 -0.0806038 8.76212 0.0508892 8.89337 0.344816L11.4212 5.98419C11.5524 6.27829 11.4212 6.62343 11.1271 6.75468C10.833 6.88593 10.4878 6.75468 10.3566 6.46058L7.82879 0.822177Z" />
      <path className="secondary" d="M9.55208 4.66699L10.3566 6.46074C10.4878 6.75484 10.833 6.88609 11.1271 6.75484C11.4212 6.62359 11.5524 6.27845 11.4212 5.98435L10.8306 4.66699H13.2222C13.6524 4.66699 14 5.01456 14 5.44477C14 5.87498 13.6524 6.22255 13.2222 6.22255L11.9608 11.266C11.7663 11.9587 11.166 12.4448 10.4514 12.4448H3.52674C2.83403 12.4448 2.21181 11.9587 2.03875 11.266L0.777778 6.22255C0.348299 6.22255 0 5.87498 0 5.44477C0 5.01456 0.348299 4.66699 0.777778 4.66699H3.16944L2.57882 5.98435C2.44757 6.27845 2.57882 6.62359 2.87292 6.75484C3.16701 6.88609 3.51215 6.75484 3.6434 6.46074L4.42604 4.66699H9.55208Z" />
    </SvgIcon>;
};

export default Ecommerce;