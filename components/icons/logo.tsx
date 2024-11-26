import clsx from 'clsx';
import Image from 'next/image';
import prodigyLogo from './prodigy-logo.png';

export default function LogoIcon(props: { className: string }) {
  return (
    <Image
      src={prodigyLogo}
      alt="Prodigy Commerce logo"
      className={clsx('h-4 w-4', props.className)}
    />
  );
}
