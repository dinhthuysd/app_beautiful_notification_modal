import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { useToast } from '../../hooks/use-toast';
import notificationService from '../../services/notificationService';
import { Bell, Send, AlertTriangle, Info, CheckCircle, XCircle, Sparkles, Mail, MessageSquare, Loader2 } from 'lucide-react';

const SendNotificationDialog = ({ isOpen, onClose, userId, userEmail }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sendTelegram, setSendTelegram] = useState(true);
  
  const [formData, setFormData] = useState({
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const data = await notificationService.getTemplates();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        type: template.type,
        title: template.title,
        message: template.message
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await notificationService.sendNotificationToUser(
        userId,
        formData,
        sendTelegram
      );
      
      toast({
        title: 'Success',
        description: 'Notification sent successfully',
        icon: <CheckCircle className="w-5 h-5" />
      });
      
      onClose();
      
      // Reset form
      setFormData({ type: 'info', title: '', message: '' });
      setSelectedTemplate('');
    } catch (error) {
      console.error('Notification error:', error);
      let errorMessage = 'Failed to send notification';
      
      // Handle validation errors properly
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        // If detail is an array of errors, extract messages
        if (Array.isArray(detail)) {
          errorMessage = detail.map(err => err.msg || JSON.stringify(err)).join('; ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (typeof detail === 'object') {
          errorMessage = JSON.stringify(detail);
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type, size = "w-5 h-5") => {
    const iconProps = { className: size };
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className={`${size} text-green-500`} />;
      case 'warning':
        return <AlertTriangle {...iconProps} className={`${size} text-yellow-500`} />;
      case 'error':
        return <XCircle {...iconProps} className={`${size} text-red-500`} />;
      default:
        return <Info {...iconProps} className={`${size} text-blue-500`} />;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50',
          border: 'border-green-200',
          iconBg: 'bg-gradient-to-br from-green-400 to-emerald-600',
          text: 'text-green-700',
          ring: 'ring-green-200'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50',
          border: 'border-yellow-200',
          iconBg: 'bg-gradient-to-br from-yellow-400 to-amber-600',
          text: 'text-yellow-700',
          ring: 'ring-yellow-200'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-red-50',
          border: 'border-red-200',
          iconBg: 'bg-gradient-to-br from-red-400 to-rose-600',
          text: 'text-red-700',
          ring: 'ring-red-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-600',
          text: 'text-blue-700',
          ring: 'ring-blue-200'
        };
    }
  };

  const typeStyles = getTypeStyles(formData.type);
  const titleLength = formData.title.length;
  const messageLength = formData.message.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <DialogHeader className="border-b border-slate-200 pb-5 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 -mx-6 -mt-6 px-6 pt-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Send className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Send Notification
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-600 flex items-center gap-2 mt-2 text-base">
            <Mail className="w-4 h-4 text-purple-500" />
            Sending to <span className="font-semibold text-purple-600">{userEmail}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-5">
          {/* Template Selection */}
          {templates.length > 0 && (
            <div className="space-y-2 animate-in fade-in-50 duration-300">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Quick Templates
                <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger className="border-2 border-slate-200 hover:border-purple-300 transition-colors duration-200 bg-white shadow-sm">
                  <SelectValue placeholder="Choose a pre-made template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type, "w-4 h-4")}
                        <span className="font-medium">{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notification Type */}
          <div className="space-y-2 animate-in fade-in-50 duration-500">
            <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Notification Type
              <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="border-2 border-slate-200 hover:border-blue-300 transition-colors duration-200 bg-white shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <Info className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-blue-900">Information</div>
                      <div className="text-xs text-slate-500">General notification</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="success" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-900">Success</div>
                      <div className="text-xs text-slate-500">Positive message</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="warning" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-yellow-900">Warning</div>
                      <div className="text-xs text-slate-500">Caution required</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="error" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-rose-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-red-900">Error</div>
                      <div className="text-xs text-slate-500">Critical alert</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2 animate-in fade-in-50 duration-700">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                Title
                <span className="text-red-500">*</span>
              </Label>
              <span className={`text-xs font-medium ${titleLength > 50 ? 'text-amber-600' : 'text-slate-400'}`}>
                {titleLength}/100
              </span>
            </div>
            <Input
              placeholder="Enter a clear and concise title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value.slice(0, 100) })}
              className="border-2 border-slate-200 hover:border-purple-300 focus:border-purple-500 transition-colors duration-200 bg-white shadow-sm"
            />
          </div>

          {/* Message */}
          <div className="space-y-2 animate-in fade-in-50 duration-1000">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Message
                <span className="text-red-500">*</span>
              </Label>
              <span className={`text-xs font-medium ${messageLength > 400 ? 'text-amber-600' : 'text-slate-400'}`}>
                {messageLength}/500
              </span>
            </div>
            <Textarea
              placeholder="Write your notification message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value.slice(0, 500) })}
              rows={5}
              className="border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200 bg-white shadow-sm resize-none"
            />
          </div>

          {/* Send to Telegram */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in-50 duration-1000">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900 cursor-pointer">Send via Telegram</Label>
                <p className="text-xs text-slate-600 mt-0.5">Also notify admin through Telegram bot</p>
              </div>
            </div>
            <Switch
              checked={sendTelegram}
              onCheckedChange={setSendTelegram}
              className={sendTelegram ? 'data-[state=checked]:bg-blue-500' : ''}
            />
          </div>

          {/* Enhanced Preview */}
          <div className="space-y-2 animate-in fade-in-50 duration-1000">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Live Preview
            </Label>
            <div className={`p-5 rounded-xl border-2 shadow-lg transition-all duration-300 ${typeStyles.bg} ${typeStyles.border}`}>
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 ${typeStyles.iconBg} rounded-xl flex items-center justify-center shadow-md`}>
                  {getTypeIcon(formData.type, "w-6 h-6 text-white")}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className={`font-bold text-base ${typeStyles.text}`}>
                    {formData.title || 'Notification Title'}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {formData.message || 'Your notification message will appear here. Type above to see the live preview update.'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    Just now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-200 pt-4 bg-gradient-to-r from-slate-50 to-white -mx-6 -mb-6 px-6 pb-6 rounded-b-lg gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
            className="flex items-center gap-2 hover:bg-slate-100 transition-colors border-2 shadow-sm"
          >
            <XCircle className="w-4 h-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.title || !formData.message}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Notification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationDialog;
