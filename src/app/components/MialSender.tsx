interface MailData {
  email:string, name:string, date:string, time:string, mode:string
}

const sendMail = async (mailData: MailData): Promise<{ success: boolean; message?: string }> => {
  try {

    const response = await fetch('/api/Mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailData),
    });
    console.log("Mail API response:", response.body);

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Failed to send mail' };
    }
  } catch (error: any) {
    return { success: false, message: 'Network error: ' + error.message };
  }
};

export default sendMail;;