import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { requireSession } from '@/lib/sessions';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user } = await requireSession(request);

  try {
    let res = await fetch('http://localhost:8000/api/users/vouchers', {
      method: 'GET',
      headers: {
        Cookie: session.get('token')!,
      },
    });

    if (!res.ok) {
      throw await res.json();
    }

    const data = await res.json();

    console.log(data);
    console.log(data?.vouchers?.userVouchers);

    return json({ vouchers: data?.vouchers?.userVouchers });
  } catch (error) {
    return null;
  }
}

export default function Points() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      {/* <div className="flex min-h-screen w-full flex-col bg-[#F8F8F8] dark:bg-[#1E1E1E]">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-[#F8F8F8] dark:bg-[#1E1E1E] sm:flex" />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-[#F8F8F8] dark:bg-[#1E1E1E] px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6" />
        </div>
      </div> */}
      <main className="h-full flex flex-wrap gap-4 items-center justify-start">
        {data?.vouchers.length ? (
          <>
            {data.vouchers.map((coupon: any) => (
              <>
                <Card className="flex-shrink flex-grow basis-1/3 max-w-sm flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between p-4 ">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {coupon?.voucher?.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Valid until{' '}
                        {new Date(coupon.expiredAt || coupon.voucher.expiredAt).toString()}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {coupon?.voucher?.discount ? (
                          <>
                            <div className="text-2xl font-bold">
                              {coupon?.voucher?.discount}%
                            </div>
                            <div className="text-sm text-[#9E9E9E] dark:text-[#BDBDBD]">
                              Discount
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-bold">
                              Rp.{coupon?.voucher?.point}
                            </div>
                            <div className="text-sm text-[#9E9E9E] dark:text-[#BDBDBD]">
                              Fixed Discount
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ))}
          </>
        ) : (
          <></>
        )}
      </main>
    </>
  );
}
