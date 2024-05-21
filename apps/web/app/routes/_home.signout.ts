import { destroySession, getSession } from "@/lib/sessions";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  let _action = formData.get('_action');

  let session = await getSession();

  if (_action === 'signout') {
    return redirect('/', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }
  // return null;
}