import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

function Demo({errorMsg}) {
  const icon = <IconInfoCircle />;
  return (
    <Alert variant="transparent" color="blue" radius="xl"  title="Alert title" icon={icon}>
     {errorMsg}
    </Alert>
  );
}
export default Demo;